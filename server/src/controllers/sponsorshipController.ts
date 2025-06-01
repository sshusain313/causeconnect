import { Request, Response } from 'express';
import Sponsorship, { SponsorshipStatus, DistributionType } from '../models/Sponsorship';

export const createSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    // Provide defaults for new schema fields if not provided
    const sponsorshipData = {
      ...req.body,
      status: SponsorshipStatus.PENDING,
      // Set default distribution type if not provided
      distributionType: req.body.distributionType || DistributionType.ONLINE,
      // Ensure distributionPoints exists with at least one default entry for online distribution
      distributionPoints: req.body.distributionPoints && req.body.distributionPoints.length > 0 
        ? req.body.distributionPoints 
        : [{ name: 'Online', address: 'N/A', contactPerson: 'N/A', phone: 'N/A' }]
    };
    
    console.log('Creating sponsorship with data:', JSON.stringify(sponsorshipData, null, 2));
    
    const sponsorship = new Sponsorship(sponsorshipData);
    await sponsorship.save();
    
    res.status(201).json(sponsorship);
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    res.status(500).json({ message: 'Error creating sponsorship', error: error.message });
  }
};

export const getPendingSponsorships = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching pending sponsorships, authenticated as:', req.user);
    
    const sponsorships = await Sponsorship.find({ status: SponsorshipStatus.PENDING })
      .populate('cause', 'title') // Populate cause with just the title field
      .sort({ createdAt: -1 });
    
    console.log('Found pending sponsorships:', sponsorships.length);
    
    res.json(sponsorships);
  } catch (error) {
    console.error('Error fetching pending sponsorships:', error);
    res.status(500).json({ message: 'Error fetching pending sponsorships' });
  }
};

export const approveSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.APPROVED;
    sponsorship.approvedBy = req.user?._id; // Assuming you have user info in the request
    sponsorship.approvedAt = new Date();
    await sponsorship.save();

    res.json(sponsorship);
  } catch (error) {
    console.error('Error approving sponsorship:', error);
    res.status(500).json({ message: 'Error approving sponsorship' });
  }
};

export const rejectSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.REJECTED;
    sponsorship.rejectionReason = req.body.reason;
    await sponsorship.save();

    res.json(sponsorship);
  } catch (error) {
    console.error('Error rejecting sponsorship:', error);
    res.status(500).json({ message: 'Error rejecting sponsorship' });
  }
};

export const getSponsorshipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id)
      .populate('cause', 'title'); // Populate cause with title
    
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }
    res.json(sponsorship);
  } catch (error) {
    console.error('Error fetching sponsorship:', error);
    res.status(500).json({ message: 'Error fetching sponsorship' });
  }
}; 