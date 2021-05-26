import { LoremIpsum } from 'lorem-ipsum';

const lipsum = new LoremIpsum({
  sentencesPerParagraph: { min: 2, max: 5 },
});

export const nodeText: Record<string, string> = {
  root: 'Welcome to my portfolio prototype',
  Project5Intro:
    'This is an intro section to this project. It will say insightful and inspiring things about the project so people can get excited about it.\n' +
    lipsum.generateParagraphs(3),
  Project5Demo:
    'This is where I will show the designs of the project. On mobile this will open up onto a full screen overlay.',
};
