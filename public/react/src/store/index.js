import {create} from 'zustand';

export const useStore = create((set, get) => ({
    pages: [],
    startPageID: '123',
    replacePages(payload) {

        set(() => ({
            pages: payload.pages
        }))

    }
}));
