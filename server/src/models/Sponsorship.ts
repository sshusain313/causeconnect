import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICause } from './Cause';

export enum SponsorshipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface IDistributionPoint {
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
}

export interface IDemographics {
  ageGroups: string[];
  income: string;
  education: string;
  other: string;
}

export interface ISponsorship extends Document {
  cause: mongoose.Types.ObjectId | ICause;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  toteQuantity: number;
  unitPrice: number;
  totalAmount: number;
  logoUrl: string;
  message: string;
  distributionPoints: IDistributionPoint[];
  distributionStartDate: Date;
  distributionEndDate: Date;
  distributionDate?: Date; // Keeping for backward compatibility
  demographics: IDemographics;
  status: SponsorshipStatus;
  approvedBy?: mongoose.Types.ObjectId | IUser;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorshipSchema = new Schema<ISponsorship>(
  {
    cause: {
      type: Schema.Types.ObjectId,
      ref: 'Cause',
      required: true
    },
    organizationName: {
      type: String,
      required: true
    },
    contactName: {
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
    toteQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 50
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    logoUrl: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    distributionPoints: [{
      name: String,
      address: String,
      contactPerson: String,
      phone: String
    }],
    distributionStartDate: {
      type: Date,
      required: true
    },
    distributionEndDate: {
      type: Date,
      required: true
    },
    distributionDate: {
      type: Date,
      required: false
    },
    demographics: {
      ageGroups: [String],
      income: String,
      education: String,
      other: String
    },
    status: {
      type: String,
      enum: Object.values(SponsorshipStatus),
      default: SponsorshipStatus.PENDING
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
sponsorshipSchema.index({ cause: 1 });
sponsorshipSchema.index({ status: 1 });
sponsorshipSchema.index({ organizationName: 1 });
sponsorshipSchema.index({ email: 1 });
sponsorshipSchema.index({ createdAt: 1 });

// Calculate totalAmount before saving
sponsorshipSchema.pre('save', function(next) {
  // Calculate total amount if not already set
  if (!this.totalAmount && this.toteQuantity && this.unitPrice) {
    this.totalAmount = this.toteQuantity * this.unitPrice;
  }
  next();
});

// Update cause's currentAmount after sponsorship is saved
sponsorshipSchema.post('save', async function() {
  try {
    // Import Cause model
    const Cause = mongoose.model('Cause');
    
    // Update the cause's current amount
    if (this.cause) {
      await Cause.updateCauseAmount(this.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount:', error);
  }
});

// Update cause's currentAmount after sponsorship is updated
sponsorshipSchema.post('findOneAndUpdate', async function(doc) {
  try {
    if (doc && doc.cause) {
      const Cause = mongoose.model('Cause');
      await Cause.updateCauseAmount(doc.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount after update:', error);
  }
});

// Update cause's currentAmount after sponsorship is removed
sponsorshipSchema.post('remove', async function() {
  try {
    if (this.cause) {
      const Cause = mongoose.model('Cause');
      await Cause.updateCauseAmount(this.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount after removal:', error);
  }
});

const Sponsorship = mongoose.models.Sponsorship || mongoose.model<ISponsorship>('Sponsorship', sponsorshipSchema);

export default Sponsorship;
