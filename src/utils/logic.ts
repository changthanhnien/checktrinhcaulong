import { questions, Question } from '../data/questions';

export type AdviceLength = 'short' | 'medium' | 'long';
export type AdviceTone = 'encouraging' | 'strict' | 'humorous';

export interface AdviceSettings {
  length: AdviceLength;
  tone: AdviceTone;
}

export interface Result {
  level: string;
  score: number;
  description: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
}

export const mapScoreToLevel = (score: number): { level: string; description: string } => {
  if (score <= 30) return { level: 'Newbie', description: 'Mới làm quen, nền tảng bước đầu, cần rèn luyện thêm cảm giác cầu.' };
  if (score <= 45) return { level: 'Yếu', description: 'Biết kỹ thuật cơ bản nhưng di chuyển và thực tế thi đấu chưa ổn định.' };
  if (score <= 58) return { level: 'Yếu+', description: 'Chơi tốt các pha cầu đơn giản, bọc lót cơ bản, đang khắc phục nhược điểm.' };
  if (score <= 68) return { level: 'TB-', description: 'Có nền tảng tương đối khá, biết định hình lối chơi riêng nhưng chưa vững chắc.' };
  if (score <= 78) return { level: 'TB', description: 'Đánh khá ổn định ở sân phong trào, khả năng điều phối cầu linh hoạt.' };
  if (score <= 86) return { level: 'TB+', description: 'Chất lượng đường cầu cao, biết kiểm soát nhịp độ trận đấu tốt.' };
  if (score <= 93) return { level: 'Khá', description: 'Bộ pháp tối ưu, tư duy chiến thuật nhạy bén, kiểm soát thế trận tự tin.' };
  return { level: 'Giỏi', description: 'Trình độ thi đấu bán chuyên hoặc phong trào xuất sắc, tinh nhuệ và bản lĩnh.' };
};

export const calculateResult = (selections: Record<string, number>, settings: AdviceSettings = { length: 'medium', tone: 'encouraging' }): Result => {
  let totalScore = 0;
  const categoryScores: { id: string; title: string; score: number }[] = [];

  questions.forEach((q) => {
    const selectedOptionId = selections[q.id];
    const option = q.options.find((o) => o.id === selectedOptionId);
    const score = option ? option.score : 0;
    
    totalScore += (score * q.weight) / 100;
    categoryScores.push({ id: q.id, title: q.title, score });
  });

  const { level, description } = mapScoreToLevel(totalScore);

  const sortedScores = [...categoryScores].sort((a, b) => b.score - a.score);
  const strengths = sortedScores.slice(0, 2).map(s => s.title);
  const weaknesses = sortedScores.slice(-2).reverse();

  const sincereAdviceMap: Record<string, { compliment: string; empathy: string; action: string }> = {
    time: {
      compliment: "rất có ý thức duy trì việc tập luyện và ra sân",
      empathy: "chưa có đủ thời gian hoặc phương pháp tối ưu để thực sự làm quen với nhịp độ thi đấu",
      action: "bạn thử dành thêm chút thời gian mỗi buổi để tâng cầu, vê cầu nhẹ nhàng nhé. Cảm giác cầu là thứ cần 'mưa dầm thấm lâu', cứ kiên nhẫn một chút, bạn sẽ thấy mình đánh chắc tay hơn hẳn."
    },
    rules: {
      compliment: "khá nhanh nhạy trên sân",
      empathy: "vẫn còn đôi chút bỡ ngỡ với các quy định, luật lệ chi tiết hoặc cách tính điểm chuẩn",
      action: "bạn hãy thử vừa chơi vừa hỏi thêm anh em trên sân về luật giao cầu, luật đứng sân nhé. Khi hiểu rõ luật, bạn sẽ tự tin hơn rất nhiều và không bị tâm lý khi đánh giải hay giao lưu."
    },
    serve: {
      compliment: "có tâm lý khá ổn định khi bắt đầu pha cầu",
      empathy: "những quả giao cầu của bạn đôi khi chưa đủ độ khó, dễ bị đối thủ bắt bài và tấn công ngay từ nhịp đầu",
      action: "mình khuyên chân thành là bạn hãy dành ra 10-15 phút mỗi buổi chỉ để tập giao cầu ngắn sát lưới. Một quả giao cầu tốt sẽ giúp bạn nắm đến **40% lợi thế** của pha bóng đó."
    },
    footwork: {
      compliment: "phản xạ tự nhiên và sức rướn khá tốt",
      empathy: "bước chân di chuyển (bộ pháp) của bạn thỉnh thoảng bị rối, dẫn đến việc hay bị hụt hơi hoặc đánh cầu ở thế bị động",
      action: "nếu được, bạn hãy tập di chuyển không cầu (shadow footwork) ở 6 góc sân. Đừng quên nhịp nhảy đệm (split step) trước khi đối thủ chạm cầu nhé, nó sẽ giúp bạn phản ứng nhanh hơn gấp bội."
    },
    technique: {
      compliment: "có lực tay tự nhiên và sự khéo léo nhất định",
      empathy: "cách phát lực và điểm tiếp xúc cầu của bạn chưa thực sự chuẩn xác, làm hao tổn sức lực mà cầu lại không đi như ý",
      action: "bạn hãy chú ý vươn tay đón cầu ở điểm cao nhất có thể, và tập cách xoay lườn, mượn lực từ hông và vai thay vì chỉ dùng mỗi lực cánh tay. Như vậy đánh vừa nhàn vừa cực kỳ uy lực."
    },
    backhand: {
      compliment: "những cú thuận tay (forehand) của bạn rất có lực và sắc nét",
      empathy: "cánh trái (backhand) dường như vẫn là điểm yếu khiến bạn thường bị đối thủ ép cầu sâu về góc này",
      action: "đừng quá áp lực, trái tay luôn là kỹ thuật khó nhất. Bạn hãy bắt đầu từ việc học cách xoay đổi tay cầm vợt (grip) thật linh hoạt, sau đó tập phông trái tay nhẹ nhàng, chú trọng độ nảy của cổ tay thay vì dùng lực cả cánh tay nhé."
    },
    attack: {
      compliment: "tinh thần máu lửa và luôn muốn chủ động tấn công ghi điểm",
      empathy: "những cú đập (smash) của bạn đôi khi chưa đủ độ cắm hoặc điểm rơi chưa thực sự làm khó được đối thủ",
      action: "thay vì dùng 100% sức mạnh cho mọi cú đập, bạn hãy thử dùng 70-80% lực nhưng ép điểm rơi sát biên hoặc nhắm vào nách, hông của đối phương. Một cú đập khéo léo luôn đáng sợ hơn một cú đập chỉ có sức mạnh thuần túy."
    },
    defense: {
      compliment: "sự lì lợm và không bao giờ bỏ cuộc trong các pha cầu giằng co",
      empathy: "khả năng thủ cầu của bạn đôi lúc bị cập rập, dễ bị bung cầu cao làm mồi ngon cho đối thủ đập bồi",
      action: "khi thủ, bạn nhớ hạ thấp trọng tâm đầu gối xuống một chút, để lỏng cổ tay và dùng lực ngón tay cái nẩy cầu tạt sâu về cuối sân. Đừng gồng cứng tay, sự mềm mại sẽ giúp bạn hóa giải mọi cú đập của đối thủ."
    },
    doubles: {
      compliment: "tinh thần đồng đội và thái độ rất hòa đồng trên sân",
      empathy: "bạn và partner đôi khi chưa thực sự hiểu ý nhau, di chuyển dễ bị giẫm chân hoặc để lộ khoảng trống ở giữa sân",
      action: "bạn hãy chú ý giao tiếp nhiều hơn với đồng đội trên sân. Hãy nhớ nguyên tắc: khi một người đập cầu thì người kia phải lên lưới, khi bị ép thủ thì hai người phải dàn ngang. Có được sự ăn ý, hai bạn sẽ cực kỳ đáng gờm."
    },
    tactics: {
      compliment: "lối đánh an toàn, ít khi tự đánh hỏng",
      empathy: "bạn thường đánh theo bản năng hơn là có một chiến thuật rõ ràng để khai thác điểm yếu của đối thủ",
      action: "trước khi giao cầu hoặc nhận giao, bạn hãy dành 2 giây nghĩ xem đối thủ đang sợ góc nào nhất. Đừng chỉ đánh cầu qua lưới, hãy điều cầu chạy khắp 4 góc sân để bào mòn thể lực của họ."
    },
    stability: {
      compliment: "sự điềm tĩnh trong nhiều tình huống xử lý khó",
      empathy: "phong độ của bạn có vẻ thất thường, lúc thăng hoa thì đánh rất hay nhưng lúc tâm lý thì lại tự hỏng khá nhiều",
      action: "để cải thiện, bạn hãy đặt mục tiêu **'đánh qua lưới và vào sân'** lên hàng đầu, thay vì cố gắng đánh những quả sát mép lưới rủi ro cao. Sự ổn định mới là chìa khóa thực sự của những tay vợt giỏi."
    },
    stamina: {
      compliment: "ý chí chiến đấu rất tuyệt vời, luôn cố gắng rướn theo từng đường cầu",
      empathy: "thể lực của bạn có dấu hiệu sụt giảm ở cuối các set đấu, khiến những pha xử lý không còn giữ được sự sắc bén",
      action: "ngoài việc đánh cầu, bạn hãy kết hợp chạy bộ nhẹ nhàng hoặc nhảy dây thêm ở nhà. Khi nền tảng thể lực dồi dào, trí óc bạn mới đủ tỉnh táo để áp dụng kỹ chiến thuật trong những điểm số quyết định cuối set."
    }
  };

  const topWeakness1 = weaknesses[0];
  const topWeakness2 = weaknesses.length > 1 ? weaknesses[1] : null;
  const topStrength1 = sortedScores[0];
  const topStrength2 = sortedScores.length > 1 ? sortedScores[1] : null;

  const greetings: Record<string, string[]> = {
    'Newbie': [
      "Chào bạn, xem qua kết quả thì mình thấy bạn đang ở những bước đầu tiên làm quen với cầu lông. Ai mới bắt đầu cũng sẽ thấy hơi ngợp một chút, nhưng đừng nản nhé, mọi tay vợt xuất sắc đều bắt đầu từ con số 0.",
      "Bạn mới bắt đầu chơi cầu đúng không nè? Chào mừng bạn đến với bộ môn tuyệt vời này! Kết quả cho thấy bạn đang trong giai đoạn xây dựng nền tảng, đây là lúc quan trọng và cũng thú vị nhất đấy."
    ],
    'Yếu': [
      "Chào bạn, kết quả cho thấy bạn đã biết cách đánh cơ bản nhưng khi vào thực chiến thì chưa bung hết được khả năng. Mình rất hiểu cảm giác này, chỉ cần thêm một chút định hướng là bạn sẽ tiến bộ cực kỳ nhanh.",
      "Nhìn vào các câu trả lời, mình cảm nhận được bạn rất đam mê nhưng thỉnh thoảng vẫn hay bị khớp trên sân. Chuyện này hết sức bình thường ở giai đoạn này, đừng tự tạo áp lực cho bản thân nhé."
    ],
    'Yếu+': [
      "Chào bạn, trình độ của bạn đang ở mức làm chủ được các pha cầu đơn giản rồi đấy. Bạn có nền tảng khá ổn, chỉ là cần thêm sự sắc bén và ổn định hơn để bứt phá khỏi mức phong trào cơ bản.",
      "Bạn chơi rất tốt ở những nhịp cầu chậm, nhưng thỉnh thoảng khi bị ép nhịp nhanh là dễ mắc lỗi. Mình thấy bạn đang đi đúng hướng rồi, chỉ cần rèn giũa thêm vài kỹ năng cốt lõi nữa thôi."
    ],
    'TB-': [
      "Chào bạn, bạn đã có một phong cách chơi khá rõ nét và đánh được ở mức trung bình của dân phong trào rồi. Thật tuyệt vời vì bạn đã nỗ lực vượt qua được giai đoạn khó khăn nhất của người mới chơi.",
      "Kết quả phản ánh bạn là một người chơi có kinh nghiệm, đánh khá chắc tay trong nhiều tình huống. Tuy nhiên, để lên được trình khá hơn, bạn sẽ cần vượt qua một 'ngưỡng' giới hạn nhỏ nữa."
    ],
    'TB': [
      "Chào bạn, trình độ Trung bình chuẩn như bạn là mức mà rất nhiều người chơi phong trào ao ước đạt được. Bạn có thể tự tin giao lưu ở hầu hết các sân rồi đấy.",
      "Mình rất ấn tượng với bộ kỹ năng tương đối đồng đều của bạn. Ở mức trình độ này, bạn đánh rất có nét, bài bản và biết cách kiểm soát nhịp độ trên sân rồi."
    ],
    'TB+': [
      "Tuyệt vời, bạn đang ở mức Trung bình khá (TB+) - một tay vợt có chất lượng đường cầu rất tốt và bộ pháp linh hoạt. Ra sân chắc chắn bạn luôn là đối thủ khó chịu với nhiều người.",
      "Chào bạn, kết quả cho thấy bạn là một người chơi phong trào dạn dày kinh nghiệm. Những pha xử lý của bạn đã mang hơi hướng của những người chơi bài bản và có tư duy chiến thuật sâu."
    ],
    'Khá': [
      "Chào cao thủ ẩn danh! Bạn đang ở trình độ Khá - sở hữu tư duy chiến thuật nhạy bén và kỹ năng đánh cầu vô cùng tự tin. Thật sự rất nể phục quá trình rèn luyện kiên bỉ của bạn.",
      "Kết quả của bạn chứng tỏ bạn đã đổ rất nhiều mồ hôi và công sức trên sân tập. Trình độ của bạn bây giờ hoàn toàn đủ sức tham gia các giải đấu phong trào và gặt hái thành tích tốt rồi."
    ],
    'Giỏi': [
      "Xin chào! Quả thực rất hiếm hoi mới thấy một người chơi có kết quả đạt đến trình độ Giỏi như bạn. Bạn gần như đã đạt đến cảnh giới cao nhất của dân phong trào hiện nay.",
      "Thật sự không có nhiều điều để góp ý cho một tay vợt ở đẳng cấp cao thế này. Kỹ thuật, thể lực và nhãn quan chiến thuật của bạn đều vô cùng xuất sắc!"
    ]
  };

  const greetingList = greetings[level] || greetings['TB'];
  const greeting = greetingList[Math.floor(Math.random() * greetingList.length)];

  let complimentText = "";
  if (topStrength1 && sincereAdviceMap[topStrength1.id]) {
    complimentText = `Mình thực sự rất ấn tượng vì bạn **${sincereAdviceMap[topStrength1.id].compliment}**.`;
    if (topStrength2 && sincereAdviceMap[topStrength2.id]) {
      complimentText += ` Không chỉ vậy, điểm sáng của bạn còn nằm ở việc bạn **${sincereAdviceMap[topStrength2.id].compliment}**. Đây là những tố chất vô giá làm nền tảng vững chắc cho quá trình phát triển của bạn.`;
    }
  }

  let empathyText = "";
  const tWeak1 = topWeakness1 || sortedScores.slice(-1)[0];
  const tWeak2 = topWeakness2 || sortedScores.slice(-2)[0];
  if (tWeak1 && sincereAdviceMap[tWeak1.id]) {
    empathyText = `Thế nhưng, như một người bạn chia sẻ thật lòng, mình nhận thấy ${sincereAdviceMap[tWeak1.id].empathy}.`;
    if (tWeak2 && sincereAdviceMap[tWeak2.id] && tWeak1.id !== tWeak2.id) {
      empathyText += ` Đôi khi, ${sincereAdviceMap[tWeak2.id].empathy}.`;
    }
    empathyText += ` Bạn đừng trăn trở hay tự ti nhé, những vấn đề này hầu như ai cũng từng trải qua và hoàn toàn có thể khắc phục được nếu ta chú tâm sửa đổi một chút.`;
  }

  let actionText = "";
  if (tWeak1 && sincereAdviceMap[tWeak1.id]) {
    actionText = `Lời khuyên chân thành nhất mình dành cho bạn lúc này là: **${sincereAdviceMap[tWeak1.id].action}**`;
    if (tWeak2 && sincereAdviceMap[tWeak2.id] && tWeak1.id !== tWeak2.id) {
      actionText += ` Bên cạnh đó, **${sincereAdviceMap[tWeak2.id].action}**`;
    }
  }

  const closings = [
    "Cầu lông không chỉ là câu chuyện của thắng thua, mà là việc chúng ta vượt qua chính mình ngày hôm qua. Mình chúc bạn luôn giữ mãi ngọn lửa đam mê, thật nhiều sức khoẻ, bình an và có những giây phút thực sự thăng hoa trên sân đấu nhé!",
    "Hành trình sống và chơi thể thao còn rất dài với vô vàn điều tốt đẹp phía trước. Mong rằng những dòng chia sẻ từ đáy lòng này sẽ phần nào giúp ích được cho bạn. Chúc bạn luôn dồi dào sức khỏe, luôn mỉm cười và tìm thấy bình yên trong mỗi đường cầu!",
    "Bất kể trình độ nào đi nữa, niềm vui khi được cầm vợt, đổ mồ hôi và xả stress mới là điều quý giá nhất. Chúc bạn sẽ luôn giữ được sự lạc quan kiên cường, sức khỏe thật dồi dào để vượt qua mọi khó khăn và chinh phục những mục tiêu ý nghĩa nhất của đời mình!"
  ];
  const closing = closings[Math.floor(Math.random() * closings.length)];

  let advice = "";
  if (settings.length === 'short') {
    advice = `${greeting} ${actionText}`;
  } else if (settings.length === 'medium') {
    advice = `${greeting} ${complimentText}\n\n${actionText}`;
  } else {
    advice = `${greeting} ${complimentText}\n\n${empathyText}\n\n${actionText}\n\n${closing}`;
  }

  return {
    level,
    score: totalScore,
    description,
    strengths,
    weaknesses: weaknesses.map(w => w.title),
    advice
  };
};
