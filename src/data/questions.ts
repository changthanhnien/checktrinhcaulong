import { 
  Clock, 
  Scale, 
  Zap, 
  Move, 
  Wrench, 
  Hand, 
  Sword, 
  Shield, 
  Users, 
  Brain, 
  Activity, 
  Battery 
} from 'lucide-react';

export interface Option {
  id: number;
  text: string;
  score: number; // 0-100 scale within the category
}

export interface Question {
  id: string;
  title: string;
  description: string;
  icon: any;
  weight: number; // Percentage (0-100)
  options: Option[];
}

export const questions: Question[] = [
  {
    id: 'time',
    title: 'Thời gian chơi cầu lông',
    description: 'Tổng thời gian bạn đã gắn bó với bộ môn này.',
    icon: Clock,
    weight: 3,
    options: [
      { id: 0, text: 'Mới chơi hoặc dưới 3 tháng', score: 10 },
      { id: 1, text: 'Khoảng 3 đến 6 tháng', score: 30 },
      { id: 2, text: 'Khoảng 6 tháng đến 1 năm', score: 50 },
      { id: 3, text: 'Khoảng 1 đến 2 năm', score: 70 },
      { id: 4, text: 'Khoảng 2 đến 4 năm', score: 90 },
      { id: 5, text: 'Trên 4 năm', score: 100 },
    ],
  },
  {
    id: 'rules',
    title: 'Mức hiểu luật và tính điểm',
    description: 'Khả năng nắm bắt luật thi đấu và cách tính điểm trong trận.',
    icon: Scale,
    weight: 4,
    options: [
      { id: 0, text: 'Hay nhầm luật, nhầm điểm, nhầm ô giao cầu', score: 10 },
      { id: 1, text: 'Biết luật cơ bản, đôi lúc vẫn nhầm', score: 40 },
      { id: 2, text: 'Nắm khá rõ luật và cách tính điểm', score: 80 },
      { id: 3, text: 'Nắm chắc luật, hầu như không nhầm', score: 100 },
    ],
  },
  {
    id: 'serve',
    title: 'Giao cầu và đỡ giao',
    description: 'Kỹ năng thực hiện quả giao cầu và xử lý quả giao của đối thủ.',
    icon: Zap,
    weight: 10,
    options: [
      { id: 0, text: 'Hay lỗi giao hoặc đỡ giao rất bị động', score: 10 },
      { id: 1, text: 'Giao và đỡ giao ở mức cơ bản', score: 40 },
      { id: 2, text: 'Giao và đỡ giao khá ổn, ít bị ngợp ở quả đầu', score: 70 },
      { id: 3, text: 'Giao và đỡ giao tốt, biết tạo lợi thế sớm', score: 90 },
      { id: 4, text: 'Giao và đỡ giao khó chịu, có chủ đích rõ', score: 100 },
    ],
  },
  {
    id: 'footwork',
    title: 'Bộ pháp và di chuyển',
    description: 'Cách bạn di chuyển trên sân để đón cầu và về vị trí.',
    icon: Move,
    weight: 16,
    options: [
      { id: 0, text: 'Di chuyển chậm, hay đứng chờ cầu', score: 10 },
      { id: 1, text: 'Có chạy theo cầu nhưng còn nặng chân', score: 30 },
      { id: 2, text: 'Di chuyển cơ bản được nhưng về vị trí chưa đều', score: 50 },
      { id: 3, text: 'Di chuyển khá ổn, biết về vị trí sau nhiều pha cầu', score: 75 },
      { id: 4, text: 'Di chuyển tốt, linh hoạt, vào cầu sớm', score: 90 },
      { id: 5, text: 'Di chuyển rất tốt, bao sân ổn và nhìn nhẹ chân', score: 100 },
    ],
  },
  {
    id: 'technique',
    title: 'Kỹ thuật cơ bản',
    description: 'Bao gồm phông, bỏ nhỏ, nâng cầu, drive, đập, chụp lưới.',
    icon: Wrench,
    weight: 16,
    options: [
      { id: 0, text: 'Chủ yếu đánh theo phản xạ, kỹ thuật chưa rõ', score: 10 },
      { id: 1, text: 'Biết vài kỹ thuật nhưng còn chập chờn', score: 30 },
      { id: 2, text: 'Làm được hầu hết kỹ thuật cơ bản', score: 60 },
      { id: 3, text: 'Kỹ thuật khá đầy đủ, dùng được trong trận', score: 80 },
      { id: 4, text: 'Kỹ thuật tốt, ít lỗi khi vào cầu', score: 95 },
      { id: 5, text: 'Kỹ thuật rất tốt, kiểm soát cầu rõ ràng', score: 100 },
    ],
  },
  {
    id: 'backhand',
    title: 'Trái tay và cảm cầu',
    description: 'Khả năng xử lý cầu bên phía không thuận và độ nhạy bén với cầu.',
    icon: Hand,
    weight: 8,
    options: [
      { id: 0, text: 'Trái tay yếu, cảm cầu chưa tốt', score: 10 },
      { id: 1, text: 'Trái tay dùng được ít, cảm cầu còn thất thường', score: 30 },
      { id: 2, text: 'Trái tay cơ bản, cảm cầu ở mức ổn', score: 60 },
      { id: 3, text: 'Trái tay khá ổn, điều cầu tương đối theo ý', score: 80 },
      { id: 4, text: 'Trái tay tốt, cảm cầu tốt', score: 95 },
      { id: 5, text: 'Trái tay và cảm cầu rất tốt, xử lý tự tin và mềm', score: 100 },
    ],
  },
  {
    id: 'attack',
    title: 'Khả năng tấn công',
    description: 'Sức mạnh và độ hiểm hóc của các cú đập, dồn cầu ép đối thủ.',
    icon: Sword,
    weight: 9,
    options: [
      { id: 0, text: 'Ít tạo áp lực cho đối thủ', score: 10 },
      { id: 1, text: 'Có đập nhưng thiếu ổn định', score: 30 },
      { id: 2, text: 'Tấn công ở mức cơ bản', score: 60 },
      { id: 3, text: 'Tấn công khá, biết dồn cầu', score: 80 },
      { id: 4, text: 'Tấn công tốt, biết đổi góc hoặc đổi nhịp', score: 95 },
      { id: 5, text: 'Tấn công sắc, hiệu quả, tạo áp lực rõ', score: 100 },
    ],
  },
  {
    id: 'defense',
    title: 'Khả năng phòng thủ',
    description: 'Khả năng đỡ smash, cứu cầu và chuyển đổi trạng thái.',
    icon: Shield,
    weight: 9,
    options: [
      { id: 0, text: 'Khó đỡ smash, dễ vỡ cầu', score: 10 },
      { id: 1, text: 'Đỡ được vài quả đơn giản', score: 30 },
      { id: 2, text: 'Phòng thủ cơ bản ổn', score: 60 },
      { id: 3, text: 'Phòng thủ khá, giữ được thêm vài nhịp', score: 80 },
      { id: 4, text: 'Phòng thủ tốt, có thể chuyển từ thủ sang phản công', score: 95 },
      { id: 5, text: 'Phòng thủ rất tốt, lì cầu và đổi hướng tốt', score: 100 },
    ],
  },
  {
    id: 'doubles',
    title: 'Đánh đôi và phối hợp',
    description: 'Khả năng xoay vị trí và bọc lót cho đồng đội trong đánh đôi.',
    icon: Users,
    weight: 8,
    options: [
      { id: 0, text: 'Chưa biết đứng vị trí khi đánh đôi', score: 10 },
      { id: 1, text: 'Biết đứng cơ bản nhưng xoay còn rối', score: 40 },
      { id: 2, text: 'Phối hợp ở mức cơ bản', score: 65 },
      { id: 3, text: 'Phối hợp khá ổn, biết trước sau hoặc trái phải', score: 85 },
      { id: 4, text: 'Phối hợp tốt, biết bọc lót cho đồng đội', score: 95 },
      { id: 5, text: 'Phối hợp rất tốt, xoay mượt và đọc tình huống tốt', score: 100 },
    ],
  },
  {
    id: 'tactics',
    title: 'Tư duy chiến thuật',
    description: 'Khả năng đọc trận đấu, khai thác điểm yếu và điều cầu thông minh.',
    icon: Brain,
    weight: 8,
    options: [
      { id: 0, text: 'Gần như chưa có chiến thuật', score: 10 },
      { id: 1, text: 'Chủ yếu đánh theo cảm giác', score: 30 },
      { id: 2, text: 'Biết đánh vào chỗ trống', score: 60 },
      { id: 3, text: 'Biết khai thác điểm yếu đối thủ', score: 80 },
      { id: 4, text: 'Biết dựng cầu, giữ nhịp, đổi nhịp', score: 95 },
      { id: 5, text: 'Đọc trận khá tốt, điều cầu thông minh', score: 100 },
    ],
  },
  {
    id: 'stability',
    title: 'Độ ổn định và lỗi tự hỏng',
    description: 'Khả năng duy trì các pha rally dài mà không tự đánh hỏng.',
    icon: Activity,
    weight: 6,
    options: [
      { id: 0, text: 'Rất hay tự đánh lỗi', score: 10 },
      { id: 1, text: 'Lỗi còn khá nhiều', score: 30 },
      { id: 2, text: 'Ổn định ở mức trung bình', score: 60 },
      { id: 3, text: 'Khá ổn định', score: 80 },
      { id: 4, text: 'Ổn định tốt, ít cho điểm oan', score: 95 },
      { id: 5, text: 'Rất ổn định, ít lỗi khi đang rally', score: 100 },
    ],
  },
  {
    id: 'stamina',
    title: 'Thể lực và độ bền',
    description: 'Sức bền và khả năng duy trì phong độ trong suốt trận đấu.',
    icon: Battery,
    weight: 3,
    options: [
      { id: 0, text: 'Mau xuống sức', score: 10 },
      { id: 1, text: 'Chơi một lúc là đuối rõ', score: 30 },
      { id: 2, text: 'Thể lực ở mức trung bình', score: 60 },
      { id: 3, text: 'Thể lực khá ổn', score: 80 },
      { id: 4, text: 'Thể lực tốt', score: 95 },
      { id: 5, text: 'Thể lực rất tốt, giữ phong độ lâu', score: 100 },
    ],
  },
];
