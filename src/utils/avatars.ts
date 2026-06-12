// Predefined 3 male and 3 female avatars to avoid external broken links
export interface AvatarItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  category: 'Championship' | 'Pro' | 'Tactical';
  url: string;
}

// Local image assets
export const FLAGSHIP_MALE = "/src/assets/images/chibi_male_champion_1781233138706.jpg";
export const FLAGSHIP_FEMALE = "/src/assets/images/chibi_female_champion_1781233150553.jpg";

export const MALE_SMASH = "/src/assets/images/chibi_male_smash_1781234025890.jpg";
export const MALE_DEFEND = "/src/assets/images/chibi_male_defend_1781234039098.jpg";

export const FEMALE_SMASH = "/src/assets/images/chibi_female_smash_1781234053238.jpg";
export const FEMALE_DEFEND = "/src/assets/images/chibi_female_defend_1781234070955.jpg";

export const getAvatars = (): AvatarItem[] => {
  return [
    {
      id: "male_1",
      name: "Nam Smash Lửa (Champion 🏆)",
      gender: 'male',
      category: 'Championship',
      url: FLAGSHIP_MALE
    },
    {
      id: "male_2",
      name: "Tiến Hắc Sét (Đấu Thủ ⚡)",
      gender: 'male',
      category: 'Pro',
      url: MALE_SMASH
    },
    {
      id: "male_3",
      name: "Tuấn Bọc Lót (Chiến Thuật 🎯)",
      gender: 'male',
      category: 'Tactical',
      url: MALE_DEFEND
    },
    {
      id: "female_1",
      name: "Nữ Hoàng Đấu Trường (Vô Địch 🏆)",
      gender: 'female',
      category: 'Championship',
      url: FLAGSHIP_FEMALE
    },
    {
      id: "female_2",
      name: "Phượng Hoàng Smash (Đấu Thủ ⚡)",
      gender: 'female',
      category: 'Pro',
      url: FEMALE_SMASH
    },
    {
      id: "female_3",
      name: "Công Chúa Bỏ Nhỏ (Chiến Thuật 🎯)",
      gender: 'female',
      category: 'Tactical',
      url: FEMALE_DEFEND
    }
  ];
};
