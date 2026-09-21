import { prisma } from './src/repositories/prisma.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function fixUrls() {
  console.log('🔍 Checking PostgreSQL Database for invalid "demo" Cloudinary URLs...');

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'cqpwjere';

  // 1. Services
  const services = await prisma.service.findMany();
  for (const s of services) {
    if (s.imageUrl && s.imageUrl.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = s.imageUrl.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Service "${s.title}": ${s.imageUrl} => ${fixedUrl}`);
      await prisma.service.update({
        where: { id: s.id },
        data: { imageUrl: fixedUrl }
      });
    }
  }

  // 2. Projects / Case Studies
  const projects = await prisma.project.findMany();
  for (const p of projects) {
    if (p.heroImage && p.heroImage.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = p.heroImage.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Project "${p.title}": ${p.heroImage} => ${fixedUrl}`);
      await prisma.project.update({
        where: { id: p.id },
        data: { heroImage: fixedUrl }
      });
    }
    if (p.coverImageUrl && p.coverImageUrl.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = p.coverImageUrl.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Project coverImageUrl "${p.title}": ${p.coverImageUrl} => ${fixedUrl}`);
      await prisma.project.update({
        where: { id: p.id },
        data: { coverImageUrl: fixedUrl }
      });
    }
  }

  // 3. Trusted Clients
  const clients = await prisma.client.findMany();
  for (const c of clients) {
    if (c.logoUrl && c.logoUrl.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = c.logoUrl.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Client "${c.name}": ${c.logoUrl} => ${fixedUrl}`);
      await prisma.client.update({
        where: { id: c.id },
        data: { logoUrl: fixedUrl }
      });
    }
  }

  // 4. Principles
  const principles = await prisma.companyPrinciple.findMany();
  for (const pr of principles) {
    if (pr.backgroundImageUrl && pr.backgroundImageUrl.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = pr.backgroundImageUrl.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Principle "${pr.title}": ${pr.backgroundImageUrl} => ${fixedUrl}`);
      await prisma.companyPrinciple.update({
        where: { id: pr.id },
        data: { backgroundImageUrl: fixedUrl }
      });
    }
  }

  // 5. Blogs
  const blogs = await prisma.blogPost.findMany();
  for (const b of blogs) {
    if (b.coverImage && b.coverImage.includes('res.cloudinary.com/demo/')) {
      const fixedUrl = b.coverImage.replace('res.cloudinary.com/demo/', `res.cloudinary.com/${cloudName}/`);
      console.log(`Fixing Blog "${b.title}": ${b.coverImage} => ${fixedUrl}`);
      await prisma.blogPost.update({
        where: { id: b.id },
        data: { coverImage: fixedUrl }
      });
    }
  }

  console.log('✅ PostgreSQL Database check and URL fix complete!');
  await prisma.$disconnect();
}

fixUrls().catch(err => {
  console.error('Error fixing URLs:', err);
  process.exit(1);
});
