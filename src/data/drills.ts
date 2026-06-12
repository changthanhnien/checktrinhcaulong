export interface Drill {
  id: string;
  title: string;
  description: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  duration: string;
  steps: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  drills: Drill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'serve',
    name: 'Giao cầu',
    icon: '🏸',
    imageUrl: 'https://picsum.photos/seed/badminton-serve/800/600',
    drills: [
      {
        id: 'short-serve-precision',
        title: 'Giao cầu ngắn chính xác',
        description: 'Tập trung vào việc đưa cầu sát mép lưới và rơi vào khu vực giao cầu ngắn.',
        difficulty: 'Dễ',
        duration: '15 phút',
        steps: [
          'Đứng ở vị trí giao cầu chuẩn.',
          'Thực hiện 20 quả giao cầu ngắn liên tiếp.',
          'Mục tiêu: 15/20 quả cầu đi sát lưới và rơi đúng ô.',
          'Nghỉ 2 phút và lặp lại 3 hiệp.'
        ]
      },
      {
        id: 'long-serve-depth',
        title: 'Giao cầu dài cuối sân',
        description: 'Tập trung vào lực đẩy để cầu rơi sát đường biên cuối sân.',
        difficulty: 'Trung bình',
        duration: '15 phút',
        steps: [
          'Thực hiện giao cầu cao sâu.',
          'Mục tiêu: Cầu phải rơi trong khoảng 30cm cuối sân.',
          'Thực hiện 20 quả mỗi hiệp.',
          'Lặp lại 3 hiệp.'
        ]
      },
      {
        id: 'flick-serve-surprise',
        title: 'Giao cầu lao (Flick Serve) bất ngờ',
        description: 'Kỹ thuật đánh lừa đối thủ bằng cách giao cầu cao sâu đột ngột khi đang ở tư thế giao cầu ngắn.',
        difficulty: 'Khó',
        duration: '15 phút',
        steps: [
          'Giữ tư thế giao cầu ngắn như bình thường.',
          'Dùng lực cổ tay búng mạnh cầu về phía cuối sân đối phương.',
          'Mục tiêu: Cầu phải bay nhanh và rơi sát biên cuối.',
          'Thực hiện 20 quả mỗi hiệp, xen kẽ với giao cầu ngắn.'
        ]
      }
    ]
  },
  {
    id: 'net-play',
    name: 'Bỏ nhỏ & Trên lưới',
    icon: '🕸️',
    imageUrl: 'https://picsum.photos/seed/badminton-net/800/600',
    drills: [
      {
        id: 'net-lift-basic',
        title: 'Bung cầu trên lưới (Net Lift)',
        description: 'Kỹ thuật cơ bản để đưa cầu từ sát lưới về cuối sân đối thủ.',
        difficulty: 'Dễ',
        duration: '15 phút',
        steps: [
          'Di chuyển lên sát lưới.',
          'Dùng lực cổ tay bung cầu cao và sâu về cuối sân.',
          'Thực hiện 20 quả bên thuận tay và 20 quả bên trái tay.',
          'Tập trung vào sự ổn định của điểm tiếp xúc.'
        ]
      },
      {
        id: 'net-tumble',
        title: 'Bỏ nhỏ lăn lưới',
        description: 'Kỹ thuật làm cho cầu lăn sát mép lưới để đối thủ khó trả cầu.',
        difficulty: 'Khó',
        duration: '20 phút',
        steps: [
          'Nhờ người tung cầu nhẹ sát lưới.',
          'Dùng cổ tay và lực đẩy nhẹ để cầu "lăn" qua lưới.',
          'Thực hiện 30 quả mỗi bên (phải và trái).',
          'Tập trung vào cảm giác tay.'
        ]
      },
      {
        id: 'net-kill',
        title: 'Vồ cầu trên lưới',
        description: 'Kết thúc điểm số khi cầu của đối thủ sang hơi cao trên lưới.',
        difficulty: 'Trung bình',
        duration: '15 phút',
        steps: [
          'Di chuyển nhanh lên lưới khi thấy cầu cao.',
          'Dùng lực cổ tay gõ cầu xuống nhanh.',
          'Thực hiện 20 lần di chuyển và vồ cầu.',
          'Chú ý không chạm lưới.'
        ]
      }
    ]
  },
  {
    id: 'footwork',
    name: 'Di chuyển (Bộ pháp)',
    icon: '👣',
    imageUrl: 'https://picsum.photos/seed/badminton-footwork/800/600',
    drills: [
      {
        id: 'six-point-shadow',
        title: 'Di chuyển 6 điểm (Shadow)',
        description: 'Tập di chuyển không cầu đến 6 góc sân để tăng sự linh hoạt.',
        difficulty: 'Trung bình',
        duration: '20 phút',
        steps: [
          'Bắt đầu từ tâm sân.',
          'Di chuyển đến 6 góc: 2 trên, 2 giữa, 2 dưới.',
          'Thực hiện 10 vòng liên tục.',
          'Nghỉ 1 phút và lặp lại 5 hiệp.'
        ]
      },
      {
        id: 'split-step-timing',
        title: 'Tập Split-step',
        description: 'Cải thiện thời điểm bật nhảy nhẹ trước khi đối thủ chạm cầu.',
        difficulty: 'Dễ',
        duration: '10 phút',
        steps: [
          'Nhảy nhẹ tại chỗ khi đối thủ (hoặc tưởng tượng) chạm cầu.',
          'Ngay lập tức lao về hướng cầu.',
          'Thực hiện 50 lần bật nhảy.',
          'Tập trung vào sự bùng nổ của đôi chân.'
        ]
      },
      {
        id: 'high-intensity-agility',
        title: 'Di chuyển đa điểm cường độ cao',
        description: 'Kết hợp di chuyển 6 điểm với tốc độ tối đa và nhặt cầu tại các góc.',
        difficulty: 'Khó',
        duration: '25 phút',
        steps: [
          'Đặt 6 quả cầu tại 6 góc sân.',
          'Di chuyển nhặt từng quả mang về tâm sân với tốc độ nhanh nhất.',
          'Thực hiện 5 hiệp, nghỉ 2 phút giữa mỗi hiệp.',
          'Yêu cầu duy trì trọng tâm thấp và bước chân linh hoạt.'
        ]
      }
    ]
  },
  {
    id: 'smash',
    name: 'Đập cầu (Smash)',
    icon: '💥',
    imageUrl: 'https://picsum.photos/seed/badminton-smash/800/600',
    drills: [
      {
        id: 'standing-smash-form',
        title: 'Kỹ thuật đập cầu đứng',
        description: 'Tập trung vào tư thế tay, vai và điểm tiếp xúc cầu mà không cần bật nhảy.',
        difficulty: 'Dễ',
        duration: '15 phút',
        steps: [
          'Đứng tại chỗ, vai hướng về phía cầu.',
          'Thực hiện cú vung vợt từ sau ra trước, tiếp xúc cầu ở vị trí cao nhất.',
          'Gập cổ tay mạnh để cầu đi cắm.',
          'Thực hiện 30 quả mỗi hiệp.'
        ]
      },
      {
        id: 'smash-and-follow',
        title: 'Đập cầu và di chuyển lên lưới',
        description: 'Kết hợp cú đập mạnh với việc lao lên lưới để dứt điểm quả cầu trả hỏng của đối thủ.',
        difficulty: 'Trung bình',
        duration: '20 phút',
        steps: [
          'Thực hiện cú đập cầu từ cuối sân.',
          'Ngay sau khi đập, di chuyển nhanh lên phía trước lưới.',
          'Thực hiện động tác vồ cầu giả định.',
          'Thực hiện 15 lần liên tục mỗi hiệp.'
        ]
      },
      {
        id: 'power-smash',
        title: 'Đập cầu uy lực',
        description: 'Phát triển lực đập và điểm rơi cắm.',
        difficulty: 'Khó',
        duration: '25 phút',
        steps: [
          'Nhờ người lốp cầu cao sâu.',
          'Bật nhảy (nếu có thể) và đập cầu hết lực.',
          'Mục tiêu: Cầu rơi trước vạch giữa sân đối phương.',
          'Thực hiện 3 hiệp, mỗi hiệp 15 quả.'
        ]
      },
      {
        id: 'jump-smash-timing',
        title: 'Timing đập nhảy',
        description: 'Cải thiện sự phối hợp giữa bật nhảy và điểm tiếp xúc cầu.',
        difficulty: 'Khó',
        duration: '20 phút',
        steps: [
          'Tập bật nhảy không cầu trước để quen nhịp.',
          'Thực hiện đập nhảy với cầu thật.',
          'Chú ý điểm tiếp xúc cầu ở vị trí cao nhất.',
          'Thực hiện 20 quả mỗi hiệp.'
        ]
      }
    ]
  },
  {
    id: 'defense',
    name: 'Phòng thủ (Defense)',
    icon: '🛡️',
    imageUrl: 'https://picsum.photos/seed/badminton-defense/800/600',
    drills: [
      {
        id: 'defensive-clear',
        title: 'Bung cầu thủ (Defensive Clear)',
        description: 'Kỹ thuật trả cầu cao sâu khi đối thủ đập cầu mạnh để lấy lại thế trận.',
        difficulty: 'Trung bình',
        duration: '20 phút',
        steps: [
          'Nhờ người đập cầu vào vị trí phòng thủ của bạn.',
          'Dùng lực cổ tay và cẳng tay để bung cầu cao về cuối sân đối phương.',
          'Mục tiêu: Cầu phải rơi sâu ở 1/3 cuối sân để đối thủ không thể đập tiếp.',
          'Thực hiện 3 hiệp, mỗi hiệp 20 quả.'
        ]
      },
      {
        id: 'low-serve-return',
        title: 'Trả giao cầu ngắn',
        description: 'Kỹ thuật xử lý chủ động khi đối thủ giao cầu ngắn sát lưới.',
        difficulty: 'Dễ',
        duration: '15 phút',
        steps: [
          'Đứng ở vị trí nhận giao cầu chuẩn, trọng tâm hơi đổ về trước.',
          'Di chuyển nhanh lên lưới ngay khi cầu vừa qua khỏi mép lưới.',
          'Thực hiện đẩy cầu sâu về góc hoặc bỏ nhỏ lại sát lưới.',
          'Thực hiện 30 lần nhận giao cầu ngắn liên tục.'
        ]
      },
      {
        id: 'drive-defense',
        title: 'Phòng thủ tạt cầu (Drive Defense)',
        description: 'Kỹ thuật phản tạt lại cú đập của đối thủ để chuyển từ thế thủ sang công.',
        difficulty: 'Khó',
        duration: '20 phút',
        steps: [
          'Nhờ người đập cầu mạnh.',
          'Thay vì bung cầu cao, hãy dùng lực cổ tay tạt cầu đi ngang và nhanh về phía biên đối phương.',
          'Yêu cầu phản xạ cực nhanh và lực cổ tay tốt.',
          'Thực hiện 20 quả mỗi hiệp.'
        ]
      }
    ]
  },
  {
    id: 'recovery',
    name: 'Phục hồi',
    icon: '🧘',
    imageUrl: 'https://picsum.photos/seed/badminton-recovery/800/600',
    drills: [
      {
        id: 'post-match-recovery',
        title: 'Bài tập phục hồi sau trận đấu',
        description: 'Tập trung vào giãn cơ và phục hồi sau trận đấu để giảm đau nhức và tăng độ linh hoạt.',
        difficulty: 'Dễ',
        duration: '10 phút',
        steps: [
          'Giãn cơ cổ và vai (2 phút).',
          'Giãn cơ tay và cổ tay (2 phút).',
          'Giãn cơ lưng và hông (2 phút).',
          'Giãn cơ đùi và bắp chân (2 phút).',
          'Hít thở sâu và thư giãn toàn thân (2 phút).'
        ]
      },
      {
        id: 'foam-rolling-routine',
        title: 'Tập với con lăn (Foam Rolling)',
        description: 'Sử dụng con lăn để massage sâu các nhóm cơ bị căng sau khi thi đấu.',
        difficulty: 'Trung bình',
        duration: '15 phút',
        steps: [
          'Lăn bắp chân và đùi sau (4 phút).',
          'Lăn đùi trước và cơ mông (4 phút).',
          'Lăn phần lưng dưới và lưng trên (4 phút).',
          'Tập trung vào các điểm bị đau (trigger points) (3 phút).'
        ]
      },
      {
        id: 'mobility-flow-advanced',
        title: 'Chuỗi bài tập linh hoạt (Mobility Flow)',
        description: 'Kết hợp các động tác yoga và giãn cơ động để tăng tối đa biên độ vận động.',
        difficulty: 'Khó',
        duration: '20 phút',
        steps: [
          'Thực hiện chuỗi chào mặt trời (Sun Salutation) (5 phút).',
          'Động tác Pigeon Pose để mở hông (5 phút).',
          'Động tác Cat-Cow và vặn mình để linh hoạt cột sống (5 phút).',
          'Giữ các tư thế giãn cơ sâu trong 30-60 giây (5 phút).'
        ]
      }
    ]
  }
];
