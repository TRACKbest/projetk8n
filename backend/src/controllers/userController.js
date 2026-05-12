const User = require('../models/User');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /api/users
 * Query params: page, limit, search, role, status, sort
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const { search, role, status, sort = '-createdAt' } = req.query;

  const filter = {};
  if (role && ['admin', 'manager', 'user'].includes(role)) filter.role = role;
  if (status && ['active', 'inactive'].includes(status)) filter.status = status;
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { department: regex },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({
    status: 'success',
    data: items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * GET /api/users/stats
 */
exports.getStats = asyncHandler(async (_req, res) => {
  const [total, active, inactive, byRole] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'inactive' }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  const roles = { admin: 0, manager: 0, user: 0 };
  byRole.forEach((r) => { roles[r._id] = r.count; });

  res.json({
    status: 'success',
    data: { total, active, inactive, roles },
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ status: 'success', data: user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', message: 'User deleted successfully' });
});
