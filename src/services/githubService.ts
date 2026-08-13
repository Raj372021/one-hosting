// Helper service to push generated web apps directly to GitHub
export interface PushToGithubParams {
  token: string;
  repoName: string;
  isPrivate: boolean;
  description?: string;
  files: { path: string; content: string }[];
}

export async function pushProjectToGithub(params: PushToGithubParams): Promise<{ success: boolean; repoUrl?: string; error?: string }> {
  const { token, repoName, isPrivate, description, files } = params;
  const cleanToken = token.trim();
  const cleanRepo = repoName.trim().replace(/[^a-zA-Z0-9_-]/g, '-');

  if (!cleanToken) {
    return { success: false, error: 'GitHub Personal Access Token (PAT) दर्ज करें। (Enter GitHub Token)' };
  }

  if (!cleanRepo) {
    return { success: false, error: 'Repository name दर्ज करें। (Enter Repository Name)' };
  }

  try {
    const authHeader = cleanToken.startsWith('ghp_') || cleanToken.startsWith('github_pat_')
      ? `token ${cleanToken}`
      : `Bearer ${cleanToken}`;

    // 1. Get authenticated user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userRes.ok) {
      const errJson = await userRes.json().catch(() => ({}));
      if (userRes.status === 401) {
        return { success: false, error: 'Invalid GitHub Token! कृपया नया Token जनरेट करें जिसमें "repo" scope की अनुमति हो।' };
      }
      return { success: false, error: errJson.message || 'GitHub Authentication विफल हुआ। Token जाँचें।' };
    }

    const userData = await userRes.json();
    const username = userData.login;

    // 2. Check if repo exists or create it
    let repoUrl = `https://github.com/${username}/${cleanRepo}`;
    const checkRepoRes = await fetch(`https://api.github.com/repos/${username}/${cleanRepo}`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!checkRepoRes.ok) {
      // Create repository
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: cleanRepo,
          description: description || 'Generated with OneHost AI Agent Coder',
          private: isPrivate,
          auto_init: true
        })
      });

      if (!createRepoRes.ok) {
        const createErr = await createRepoRes.json().catch(() => ({}));
        return { success: false, error: createErr.message || 'Failed to create GitHub repository. Check "repo" scope permission.' };
      }
      // Wait 1.5 seconds for GitHub repo initialization
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 3. Push files to the repository
    let uploadedCount = 0;
    for (const file of files) {
      let sha: string | undefined;
      const getFileRes = await fetch(`https://api.github.com/repos/${username}/${cleanRepo}/contents/${file.path}`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      // Convert content to Base64 (handling UTF-8)
      const base64Content = btoa(unescape(encodeURIComponent(file.content)));

      const putRes = await fetch(`https://api.github.com/repos/${username}/${cleanRepo}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add ${file.path} via OneHost AI Agent Coder`,
          content: base64Content,
          sha
        })
      });

      if (putRes.ok) {
        uploadedCount++;
      } else {
        console.warn(`Warning: Failed to upload ${file.path} to GitHub`, await putRes.text());
      }
    }

    if (uploadedCount === 0 && files.length > 0) {
      return { success: false, error: 'Files upload call failed. Please check token permissions.' };
    }

    return {
      success: true,
      repoUrl
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error pushing to GitHub.' };
  }
}
