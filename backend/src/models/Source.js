import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // 来源可信度评分
  credibilityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  // 来源可信度等级
  credibilityLevel: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  // 来源类型
  type: {
    type: String,
    enum: ['Mainstream', 'Alternative', 'Social Media', 'Blog', 'Government', 'International'],
    default: 'Mainstream'
  },
  // 政治倾向（如果适用）
  bias: {
    type: String,
    enum: ['Left', 'Center-Left', 'Center', 'Center-Right', 'Right', 'Neutral', 'Unknown'],
    default: 'Unknown'
  },
  // 审核状态
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedDate: {
    type: Date
  },
  // 关联的新闻数量
  newsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 自动更新updatedAt字段
sourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Source = mongoose.model('Source', sourceSchema);

export default Source;