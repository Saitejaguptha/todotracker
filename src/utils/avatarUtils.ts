export const getAvatarUrl = (gender: string = 'other', name: string = 'User') => {
    const seed = name || 'User';
    const normalizedGender = gender?.toLowerCase();

    if (normalizedGender === 'female') {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf`;
    }
    if (normalizedGender === 'male') {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede`;
    }
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}&backgroundColor=b6e3f4`;
};
