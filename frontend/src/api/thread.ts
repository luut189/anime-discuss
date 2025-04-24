import { IComment, IThread } from '@/common/interfaces';

const BASE_URL = '/api/thread';

interface ThreadData {
    mal_id: string;
    author: string;
    title: string;
    content: string;
}

interface CommentData {
    author: string;
    content: string;
    threadId: string;
    parentCommentId?: string;
}

export async function createThread(data: ThreadData, isAuthenticated: boolean) {
    try {
        const response = await fetch(`${BASE_URL}/${isAuthenticated ? 'auth' : 'public'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create thread: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating thread:', error);
        throw error;
    }
}

export async function createComment(data: CommentData) {
    try {
        const response = await fetch(`${BASE_URL}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create comment: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}

export async function getAllThreads() {
    try {
        const response = await fetch(`${BASE_URL}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch all threads: ${response.statusText}`);
        }
        return (await response.json()) as IThread[];
    } catch (error) {
        console.error('Error fetching all threads:', error);
        throw error;
    }
}

export async function getThreadsByMalId(mal_id: string) {
    try {
        const response = await fetch(`${BASE_URL}/anime/${mal_id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch threads: ${response.statusText}`);
        }

        return (await response.json()) as IThread[];
    } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
    }
}

export async function getThreadById(id: string) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch threads ${response.statusText}`);
        }

        return (await response.json()) as IThread;
    } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
    }
}

export async function getCommentsByThreadId(id: string) {
    try {
        const response = await fetch(`${BASE_URL}/comment/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to comment of thread ${id} ${response.statusText}`);
        }

        return (await response.json()) as IComment[];
    } catch (error) {
        console.error(`Error fetching comments of thread ${id}:`, error);
        throw error;
    }
}

export async function deleteThread(id: string, isAuthenticated: boolean) {
    try {
        const response = await fetch(`${BASE_URL}/${isAuthenticated ? 'auth' : 'public'}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete thread: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting thread:', error);
        throw error;
    }
}
