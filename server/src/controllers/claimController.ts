import { Request, Response } from 'express';
import Claim, { ClaimStatus } from '../models/claims';

// Create a new claim
export const createClaim = async (req: Request, res: Response): Promise<void> => {
  try {
    const claimData = req.body;
    const claim = await Claim.create(claimData);
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ message: 'Error creating claim' });
  }
};

// Get recent claims for admin dashboard
export const getRecentClaims = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const claims = await Claim.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('causeTitle fullName email status createdAt');

    const total = await Claim.countDocuments();

    res.status(200).json({
      claims,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recent claims:', error);
    res.status(500).json({ message: 'Error fetching recent claims' });
  }
};

// Get claim by ID
export const getClaimById = async (req: Request, res: Response): Promise<void> => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      res.status(404).json({ message: 'Claim not found' });
      return;
    }
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: 'Error fetching claim' });
  }
};

// Update claim status
export const updateClaimStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      res.status(404).json({ message: 'Claim not found' });
      return;
    }

    claim.status = status;
    
    // Update shipping or delivery date based on status
    if (status === ClaimStatus.SHIPPED) {
      claim.shippingDate = new Date();
    } else if (status === ClaimStatus.DELIVERED) {
      claim.deliveryDate = new Date();
    }

    await claim.save();
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({ message: 'Error updating claim status' });
  }
};

// Get claims statistics
export const getClaimsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Claim.countDocuments();
    const today = await Claim.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.status(200).json({
      byStatus: stats,
      total,
      today
    });
  } catch (error) {
    console.error('Error fetching claims statistics:', error);
    res.status(500).json({ message: 'Error fetching claims statistics' });
  }
}; 