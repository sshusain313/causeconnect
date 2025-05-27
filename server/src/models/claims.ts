import mongoose, { Document, Schema } from 'mongoose';

export enum ClaimStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface IClaim extends Document {
  causeId: mongoose.Types.ObjectId;
  causeTitle: string;
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: ClaimStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  shippingDate?: Date;
  deliveryDate?: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    causeId: {
      type: Schema.Types.ObjectId,
      ref: 'Cause',
      required: true
    },
    causeTitle: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ClaimStatus),
      default: ClaimStatus.PENDING
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    shippingDate: {
      type: Date
    },
    deliveryDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
claimSchema.index({ createdAt: -1 });
claimSchema.index({ status: 1 });
claimSchema.index({ causeId: 1 });
claimSchema.index({ email: 1 });

export default mongoose.model<IClaim>('Claim', claimSchema);
