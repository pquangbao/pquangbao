const GITHUB_API = 'https://api.github.com';
const GIST_FILENAME = 'logistics_backup.json';

interface GistFile {
    content: string;
}

interface GistBody {
    description: string;
    public: boolean;
    files: {
        [filename: string]: GistFile;
    };
}

const createHeaders = (pat: string) => {
    return {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${pat}`,
        'X-GitHub-Api-Version': '2022-11-28'
    };
};

export const createGist = async (pat: string, content: object): Promise<{ id: string }> => {
    const body: GistBody = {
        description: 'Logistics App Data Backup',
        public: false,
        files: {
            [GIST_FILENAME]: {
                content: JSON.stringify(content, null, 2)
            }
        }
    };

    const response = await fetch(`${GITHUB_API}/gists`, {
        method: 'POST',
        headers: createHeaders(pat),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return { id: data.id };
};

export const updateGist = async (pat: string, gistId: string, content: object): Promise<void> => {
     const body = {
        files: {
            [GIST_FILENAME]: {
                content: JSON.stringify(content, null, 2)
            }
        }
    };

    const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
        method: 'PATCH',
        headers: createHeaders(pat),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
    }
};

export const getGist = async (pat: string, gistId: string): Promise<any> => {
    const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
        method: 'GET',
        headers: createHeaders(pat)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    const file = data.files[GIST_FILENAME];
    if (!file) {
        throw new Error(`File ${GIST_FILENAME} not found in Gist.`);
    }

    return JSON.parse(file.content);
};
