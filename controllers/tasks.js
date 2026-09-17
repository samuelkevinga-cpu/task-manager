const mongoose = require('mongoose');
const Task = require('../models/Task');

const applyCompletedSync = (payload) => {
  const data = { ...payload };

  if (data.status === 'completed') {
    data.completed = true;
  } else if (typeof data.status === 'string') {
    data.completed = false;
  }

  if (data.completed === true || data.completed === 'true') {
    data.completed = true;
    data.status = 'completed';
  } else if (data.completed === false || data.completed === 'false') {
    data.completed = false;
    if (data.status === 'completed') {
      data.status = 'pending';
    }
  }

  return data;
};

const ownedBy = (task, userId) =>
  String(task.userId?._id || task.userId) === String(userId);

const getAll = async (req, res) => {
  try {
    // Default: hide completed. Use ?completed=true to show completed tasks only.
    // Both user and admin only see their own tasks.
    const showCompleted = req.query.completed === 'true';
    const filter = {
      userId: req.user._id,
      completed: showCompleted
    };

    const tasks = await Task.find(filter)
      .sort({ createdAt: 1 })
      .populate('userId', 'firstName lastName email role');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tasks', error: error.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id).populate('userId', 'firstName lastName email role');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!ownedBy(task, req.user._id)) {
      return res.status(403).json({ message: 'You can only access your own tasks' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get task', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const data = applyCompletedSync(req.body);
    // Force ownership to the authenticated account (user or admin)
    data.userId = req.user._id;

    const task = await Task.create(data);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!ownedBy(existing, req.user._id)) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }

    const data = applyCompletedSync(req.body);
    data.userId = req.user._id;

    const task = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!ownedBy(existing, req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own tasks' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTask,
  updateTask,
  deleteTask
};
