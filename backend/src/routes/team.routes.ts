import { Router } from 'express';
import { TeamRepository } from '../repositories/team.repository.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const teamRouter = Router();

// ==========================================
// PUBLIC TEAM ENDPOINTS
// ==========================================

// GET /api/team - Returns published active members for frontend
teamRouter.get('/team', async (req, res) => {
  try {
    const members = await TeamRepository.getPublicTeamMembers();
    
    // Map response to match public contract
    const formatted = members.map(m => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      title: m.title,
      shortBio: m.shortBio,
      longBio: m.longBio,
      profileImage: {
        url: m.profileImageUrl,
        alt: m.profileImageAlt || `${m.name} - ${m.title} at Ryzite`,
        publicId: m.profileImagePublicId,
        width: m.profileImageWidth,
        height: m.profileImageHeight
      },
      expertise: m.expertise,
      technologies: m.technologies,
      linkedinUrl: m.linkedinUrl,
      githubUrl: m.githubUrl,
      displayOrder: m.displayOrder
    }));

    res.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error('[GET /api/team Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN TEAM CMS ENDPOINTS
// ==========================================

// GET /api/admin/team - Admin list
teamRouter.get('/admin/team', async (req, res) => {
  try {
    const members = await TeamRepository.getAdminTeamMembers();
    res.json({ success: true, data: members });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/team/upload-image - Upload image to dedicated Cloudinary folder ryzite/team
teamRouter.post('/admin/team/upload-image', async (req, res) => {
  try {
    const { fileData, filename } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No image data provided.' });
    }

    // Stable unique identifier: ryzite/team/team_<timestamp>_<random>
    const uniqueId = `team_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const folder = 'ryzite/team';

    const uploadResult = await cloudinaryService.uploadImage(fileData, {
      folder,
      filename: filename || uniqueId
    });

    res.json({
      success: true,
      data: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        alt: `${filename || 'Team Member'} Profile Photo`
      }
    });
  } catch (err: any) {
    console.error('[TEAM IMAGE UPLOAD ERROR]', err);
    res.status(500).json({ success: false, error: 'Image upload failed: ' + err.message });
  }
});

// POST /api/admin/team - Create team member
teamRouter.post('/admin/team', async (req, res) => {
  try {
    const member = await TeamRepository.createTeamMember(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/team/:id - Update member
teamRouter.put('/admin/team/:id', async (req, res) => {
  try {
    const member = await TeamRepository.updateTeamMember(req.params.id, req.body);
    res.json({ success: true, data: member });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/team/:id - Transactional Delete (Cloudinary destroy first, DB delete second)
teamRouter.delete('/admin/team/:id', async (req, res) => {
  try {
    await TeamRepository.deleteTeamMember(req.params.id);
    res.json({ success: true, message: 'Team member and profile photo deleted successfully.' });
  } catch (err: any) {
    console.error('[TEAM DELETE TRANSACTION ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/team/reorder - Reorder team members
teamRouter.patch('/admin/team/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required.' });
    }
    const updated = await TeamRepository.reorderMembers(items);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
