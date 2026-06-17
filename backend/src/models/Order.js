import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    }
  },
  shipping: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    deliveryZone: {
      type: String,
      enum: ['local', 'state', 'national'],
      default: 'local'
    }
  },
  items: [OrderItemSchema],
  financials: {
    subtotal: {
      type: Number,
      required: true
    },
    gst: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    trim: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['received', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'received'
  }
}, {
  timestamps: true
});

// Create indexes to optimize dashboard analytics and search performance
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model('Order', OrderSchema);

export default Order;
