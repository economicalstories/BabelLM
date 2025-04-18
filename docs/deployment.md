# Deploying BabelLM to Vercel

## Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Git repository with your BabelLM project
3. OpenAI API key

## Deployment Steps

### 1. Prepare Your Project
- Ensure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Make sure your `package.json` and other configuration files are committed
- **Important**: Do NOT commit your `.env` file to the repository

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `/` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Environment Variables
In the Vercel project settings, add the following environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key

### 4. Deployment Settings
- Runtime: Node.js
- Node.js Version: 18.x or higher (recommended)
- Build Command: `npm run build`
- Output Directory: `.next`

### 5. Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Once deployed, Vercel will provide you with a URL for your application

### 6. Post-Deployment
- Test your application using the provided Vercel URL
- Set up a custom domain if desired (optional)
- Configure any additional settings in the Vercel dashboard

## Important Notes
1. **Environment Variables**: Make sure to add all necessary environment variables in the Vercel dashboard
2. **Build Cache**: Vercel will automatically cache your builds for faster subsequent deployments
3. **Automatic Deployments**: Vercel will automatically deploy new changes when you push to your repository
4. **Preview Deployments**: Vercel creates preview deployments for pull requests automatically

## Troubleshooting
If you encounter any issues:
1. Check the deployment logs in the Vercel dashboard
2. Verify all environment variables are correctly set
3. Ensure your `package.json` has the correct build scripts
4. Check that all dependencies are properly listed in `package.json`

## Additional Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) 