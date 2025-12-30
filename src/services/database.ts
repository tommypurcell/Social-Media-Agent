import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import type { Post, Message } from '../lib/types';

export const database = {
    async savePost(post: Post): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'posts'), {
                ...post,
                timestamp: Timestamp.fromMillis(post.timestamp)
            });
            console.log('Post saved with ID: ', docRef.id);
            return docRef.id;
        } catch (e) {
            console.error('Error adding post: ', e);
            throw e;
        }
    },

    async getPosts(): Promise<Post[]> {
        try {
            const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    timestamp: data.timestamp.toMillis()
                } as Post;
            });
        } catch (e) {
            console.error('Error getting posts: ', e);
            return [];
        }
    },

    async saveMessage(message: Message): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'messages'), {
                ...message,
                timestamp: Timestamp.fromMillis(message.timestamp)
            });
            return docRef.id;
        } catch (e) {
            console.error('Error adding message: ', e);
            throw e;
        }
    },

    async getMessages(userId?: string): Promise<Message[]> {
        try {
            let q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
            if (userId) {
                // If we want to filter by creating/participating user in future
                q = query(collection(db, 'messages'), where('sender', '==', userId), orderBy('timestamp', 'asc'));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    timestamp: data.timestamp.toMillis()
                } as Message;
            });
        } catch (e) {
            console.error('Error getting messages: ', e);
            return [];
        }
    }
};
