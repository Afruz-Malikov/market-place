import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder } from '../../types/Categories';

interface FolderInitialState {
  folder: Folder[];
}
const initialState: FolderInitialState = {
  folder: [],
};
export const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folder = action.payload;
    },
  },
});
export const { setFolders } = folderSlice.actions;
