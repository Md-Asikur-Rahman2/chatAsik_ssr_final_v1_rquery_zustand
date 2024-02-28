import {create} from "zustand";

// Define the user interface
interface User {
  username: string;
  _id: string;
  pic: string;
  email: string;
}

// Create a Zustand store
interface UserStore {
  selectedAddGroupUsers: User[];
  addAddGroupSelectUser: (user: User) => void;
  removeAddSelectedUser: (userId: string) => void;
  selectedGroupUsers: User[];
  addGroupSelectUser: (user: User) => void;
  removeSelectedUser: (userId: string) => void;
}

const useGroupStore = create<UserStore>((set) => ({
  selectedGroupUsers: [],
  addGroupSelectUser: (user) =>
    set((state) => {
      // Check if the user already exists
      const userExists = state.selectedGroupUsers.some(
        (existingUser) => existingUser._id === user._id
      );

      if (userExists) {
        // If the user exists, remove them
        return {
          selectedGroupUsers: state.selectedGroupUsers.filter(
            (existingUser) => existingUser._id !== user._id
          ),
        };
      } else {
        // If the user doesn't exist, add them
        return { selectedGroupUsers: [...state.selectedGroupUsers, user] };
      }
    }),
  removeSelectedUser: (userId) =>
    set((state) => ({
      selectedGroupUsers: state.selectedGroupUsers.filter((user) => user._id !== userId),
    })),

  selectedAddGroupUsers: [],
  addAddGroupSelectUser: (user) =>
    set((state) => {
      // Check if the user already exists
      const userExists = state.selectedAddGroupUsers.some(
        (existingUser) => existingUser._id === user._id
      );

      if (userExists) {
        // If the user exists, remove them
        return {
          selectedAddGroupUsers: state.selectedAddGroupUsers.filter(
            (existingUser) => existingUser._id !== user._id
          ),
        };
      } else {
        // If the user doesn't exist, add them
        return { selectedAddGroupUsers: [...state.selectedAddGroupUsers, user] };
      }
    }),
  removeAddSelectedUser: (userId) =>
    set((state) => ({
      selectedAddGroupUsers: state.selectedAddGroupUsers.filter((user) => user._id !== userId),
    })),
}));

export default useGroupStore;
