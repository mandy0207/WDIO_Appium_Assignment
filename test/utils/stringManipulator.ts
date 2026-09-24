class StringManipulator {

    public removeSpecialCharacters(value: string, keep: string = ''): string {
        return value.replace(this.buildSpecialCharacterPattern(keep), '');
    }

    public replaceSpecialCharacters(value: string, replacement: string, keep: string = ''): string {
        return value.replace(this.buildSpecialCharacterPattern(keep), replacement);
    }

    private buildSpecialCharacterPattern(keep: string): RegExp {
        const escapedKeep = keep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`[^a-zA-Z0-9\\s${escapedKeep}]`, 'g');
    }
}

export default new StringManipulator();
