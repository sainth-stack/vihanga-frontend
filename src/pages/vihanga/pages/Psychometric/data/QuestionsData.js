import { Images } from "./Images";

export const questions = [
   {
     id: 1,
     question: "What does freedom mean to you personally?",
     options: [
       {
         label: "A",
         image: Images.img1,
         isImage: true,
         category: [
           "RealWorlders,ImplementationSpecialists,DisruptiveInnovator",
         ],
       },
       {
         label: "B",
         image: Images.img2,
         isImage: true,
         category: ["ImplementationSpecialists"],
       },
       {
         label: "C",
         image: Images.img3,
         isImage: true,
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 2,
     question:
       "If you could swap personalities with someone for a year, who would you choose and why?",
     options: [
       {
         label: "A",
         image: Images.img4,
         isImage: true,
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         image: Images.img5,
         isImage: true,
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "C",
         image: Images.img6,
         isImage: true,
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 3,
     question: "What kind of work environment suits you best?",
     options: [
       {
         label: "A",
         image: Images.img7,
         isImage: true,
         category: ["ImplementationSpecialists"],
       },
       {
         label: "B",
         image: Images.img8,
         isImage: true,
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "C",
         image: Images.img9,
         isImage: true,
         category: ["DisruptiveInnovator"],
       },
     ],
   },
   {
     id: 4,
     question: "Which image resonates more with you?",
     options: [
       {
         label: "A",
         image: Images.img10,
         isImage: true,
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "B",
         image: Images.img11,
         isImage: true,
         category: ["DisruptiveInnovator"],
       },
       {
         label: "C",
         image: Images.img12,
         isImage: true,
         category: ["ImplementationSpecialists,RealWorlders"],
       },
     ],
   },
   {
     id: 5,
     question: "Do you tend to let things happen ?",
     options: [
       {
         label: "A",
         text: " On their own",
         category: ["ImplementationSpecialists"],
       },
       {
         label: "B",
         text: "Do you take control",
         category: ["DisruptiveInnovator,RealWorlders"],
       },
       {
         label: "C",
         text: "By careful planing",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 6,
     question: "Do you tend to ?",
     options: [
       {
         label: "A",
         text: " To follow a structured plan or procedure",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "B",
         text: "To learn through self-discovery and experimentation",
         category: ["DisruptiveInnovator"],
       },
     ],
   },
   {
     id: 7,
     question: "Do you usually?",
     options: [
       {
         label: "A",
         text: "Think and plan before taking action",
         category: ["RealWorlders"],
       },
       {
         label: "B",
         text: "Go with the flow",
         category: ["ImplementationSpecialists"],
       },
     ],
   },

   {
     id: 8,
     question: "You Tend To ?",
     options: [
       {
         label: "A",
         text: "Maintain a large social circle",
         category: ["DisruptiveInnovator,RealWorlders"],
       },
       {
         label: "B",
         text: "Have a small, tight-knit group of close relationships",
         category: ["ImplementationSpecialists"],
       },
     ],
   },

   {
     id: 9,
     question: "You Likely?",
     options: [
       {
         label: "A",
         text: "tend to exit parties early, to catch up next day work.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "B",
         text: "stay late and feel energized at parties",
         category: ["DisruptiveInnovator"],
       },
     ],
   },
   {
     id: 10,
     question: "You tend to?",
     options: [
       {
         label: "A",
         text: "instinctively guide others towards growth",
         category: ["RealWorlders"],
       },
       {
         label: "B",
         text: "Show appreciation to boost teamwork.",
         category: [ "ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 11,
     question: "You trust?",
     options: [
       {
         label: "A",
         text: "Evidence-based decision making",
         category: ["RealWorlders"],
       },
       {
         label: "B",
         text: "Gut feeling",
         category: ["DisruptiveInnovator"],
       },
     ],
   },
   {
     id: 12,
     question: "You focus on?",
     options: [
       {
         label: "A",
         text: "New ideas",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "facts and the current situation.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 13,
     question: "You tend to?",
     options: [
       {
         label: "A",
         text: "over-research and get bogged down in details.",
         category: ["RealWorlders"],
       },
       {
         label: "B",
         text: "spend too much time collecting information.",
         category: [ "ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 14,
     question: "You possess?",
     options: [
       {
         label: "A",
         text: "a keen eye for detail and observation.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "B",
         text: "the ability to see beyond the surface and understand things profoundly.",
         category: ["DisruptiveInnovator"],
       },
     ],
   },
   {
     id: 15,
     question: "You tend to?",
     options: [
       {
         label: "A",
         text: "rely on concrete evidence and tangible experiences.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "B",
         text: "abstract thinking",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "C",
         text: "rely on concepts and principles",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
     ],
   },

   {
     id: 16,
     question: "If you get a call from your manager, you ?",
     options: [
       {
         label: "A",
         text: "Consider if you can ignore this call and handle it over text?",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Answer immediately.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 17,
     question: "What’s your focus in meetings?",
     options: [
       {
         label: "A",
         text: "Ideas",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Solutions",
         category: ["RealWorlders"],
       },
       {
         label: "C",
         text: "Details",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 18,
     question:
       "Your team is handling a critical project with a tight deadline. Midway through, a major issue arises, and the project is at risk of failure. How would you handle this situation?",
     options: [
       {
         label: "A",
         text: "Propose bold, unconventional ideas that challenge traditional norms, even if they seem risky.",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Wait for instructions from a team leader and focus on completing the tasks assigned to you.",
         category: ["RealWorlders,ImplementationSpecialists"],
       },
       {
         label: "C",
         text: "Focus on refining others’ ideas and outlining how they can be realistically implemented.",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 19,
     question:
       "Two of your colleagues have a disagreement about task ownership in an ongoing project. The argument is delaying progress and increasing team tension. What is your response to this conflict? What role do you play in resolving the issue?",
     options: [
       {
         label: "A",
         text: "Brainstorm creative, out-of-the-box solutions to bypass the roadblock entirely.",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Analyze the situation and recommend practical adjustments based on available resources.",
         category: ["RealWorlders"],
       },
       {
         label: "C",
         text: "Take the lead in implementing the chosen solution step-by-step to ensure success.",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 20,
     question:
       "Your team is working on a complex project with tight deadlines. Effective collaboration is critical to success. How do you approach your role in the team?",
     options: [
       {
         label: "A",
         text: "Inspire the team with forward-thinking ideas and encourage a culture of experimentation.",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Serve as a voice of reason, keeping the team focused on achievable goals and realistic outcomes.",
         category: ["RealWorlders"],
       },
       {
         label: "C",
         text: "Organize and manage the project’s tasks to ensure timely and effective completion.",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 21,
     question:
       "Your team’s morale is low after facing multiple setbacks. How do you uplift and motivate the team?",
     options: [
       {
         label: "A",
         text: "Encourage the team to embrace creative risks and see setbacks as opportunities for innovation.",
         category: ["DisruptiveInnovator"],
       },
       {
         label: "B",
         text: "Reassure the team by focusing on realistic goals and achievable milestones.",
         category: ["RealWorlders"],
       },
       {
         label: "C",
         text: "Lead by example, demonstrating commitment to completing tasks and encouraging collaboration.",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
   {
     id: 22,
     question: "How do you prioritize tasks in a busy project?",
    //  hi/*  */
     options: [
       {
         label: "A",
         text: "Pursue impactful ideas.",
         category: ["DisruptiveInnovator"],
       },
      //  commented
       {
         label: "B",
         text: "Focus on what’s realistic.",
         category: ["RealWorlders"],
       },
       {
         label: "C",
         text: "Address operational needs first.",
         category: ["ImplementationSpecialists"],
       },
     ],
   },
  {
    id: 23,
    question:
      "Your hard work and contributions are going unnoticed by your manager. You're putting in extra effort, delivering high-quality results, and taking on additional responsibilities, but somehow, your achievements are not being recognized or valued. How would you approach this?",
    options: [
      {
        label: "A",
        text: "Schedule a meeting with my manager.",
        category: ["RealWorlders,DisruptiveInnovator"],
      },
      {
        label: "B",
        text: "I will not work any more with them.",
        category: ["DisruptiveInnovator"],
      },
      {
        label: "C",
        text: "Frustrated, but will wait for the right time.",
        category: ["ImplementationSpecialists"],
      },
    ],
  },

  {
    id: 24,
    question: "How do you collaborate in a team?",
    options: [
      {
        label: "A",
        image: Images.img13,
        isImage: true,
        category: ["DisruptiveInnovator"],
      },
      {
        label: "B",
        image: Images.img14,
        isImage: true,
        category: ["RealWorlders"],
      },
      {
        label: "C",
        image: Images.img15,
        isImage: true,
        category: ["ImplementationSpecialists"],
      },
    ],
  },
  {
    id: 25,
    question: "How do you prioritize tasks?",
    options: [
      {
        label: "A",
        image: Images.img16,
        isImage: true,
        category: ["DisruptiveInnovator"],
      },
      {
        label: "B",
        image: Images.img17,
        isImage: true,
        category: ["RealWorlders"],
      },
      {
        label: "C",
        image: Images.img18,
        isImage: true,
        category: ["ImplementationSpecialists"],
      },
    ],
  },
];
