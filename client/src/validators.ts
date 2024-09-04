export function validateTitle(text: string): string {
    if(text.trim().length < 12) return "title must be longer than 12 characters"
    if (text.trim().length === 0) return "title is required";
    return "";
};

export function validateDescription(text: string): string {
    const textWithoutTags = text.replace(/<[^>]*>/g, '')
    console.log(textWithoutTags)
    if(textWithoutTags.trim().length < 50) return "description must be longer than 50 characters"
    if (textWithoutTags.trim().length === 0) return "title is required";
    return "";
};