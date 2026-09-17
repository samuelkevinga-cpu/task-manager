const mongoose = require('mongoose');

/**
 * Seven application fields (plus Mongoose timestamps):
 * title, description, status, priority, dueDate, userId, completed
 * completed=true tasks are hidden from default GET /tasks
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

taskSchema.pre('save', function syncCompleted(next) {
  if (this.isModified('status') || this.isNew) {
    this.completed = this.status === 'completed';
  }
  if (this.isModified('completed') && this.completed) {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
