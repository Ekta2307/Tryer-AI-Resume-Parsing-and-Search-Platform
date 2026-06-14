const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const SUPPORTED_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const COMMON_SKILLS = [
  'javascript', 'typescript', 'java', 'python', 'c++', 'c#', 'react', 'vue', 'angular',
  'node.js', 'express', 'mongodb', 'mysql', 'postgresql', 'html', 'css', 'tailwind',
  'bootstrap', 'git', 'docker', 'aws', 'azure', 'rest api', 'graphql', 'machine learning',
  'data analysis', 'excel', 'power bi', 'nlp', 'tensorflow', 'pytorch',
];

const normalizeText = (text) => text
  .replace(/\r/g, '\n')
  .replace(/\t/g, ' ')
  .replace(/[ ]{2,}/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const compactText = (text) => normalizeText(text).replace(/\n/g, ' ');

const extractField = (labels, text) => {
  const oneLine = compactText(text);

  for (const label of labels) {
    const pattern = new RegExp(`${label}\\s*[:\\-]?\\s*(.*?)(?=\\s(?:name|email|phone|skills|experience|location|education|projects)\\s*[:\\-]|$)`, 'i');
    const match = oneLine.match(pattern);
    if (match?.[1]) {
      return match[1].trim().slice(0, 160);
    }
  }

  return '';
};

const splitList = (value) => {
  if (!value) return [];

  return value
    .split(/[,|;|\n|•|·]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase() : '';
};

const extractPhone = (text) => {
  const matches = text.match(/(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/g);
  if (!matches) return '';

  const valid = matches.find((phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  });

  return valid ? valid.trim() : '';
};

const extractName = (text, email) => {
  const ignoredWords = /resume|curriculum|vitae|email|phone|mobile|address|linkedin|github|portfolio/i;
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.length <= 70 && !line.includes('@') && !ignoredWords.test(line));

  const explicitName = extractField(['Name', 'Full Name', 'Candidate Name'], text);
  if (explicitName) return explicitName;

  const likelyName = lines.find((line) => /^[A-Za-z][A-Za-z.'-]+(?:\s+[A-Za-z][A-Za-z.'-]+){1,3}$/.test(line));
  if (likelyName) return likelyName;

  return email ? email.split('@')[0].replace(/[._-]/g, ' ') : 'Unknown';
};

const extractExperienceYears = (text) => {
  const match = text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years|yrs|year)/i);
  return match ? Number(match[1]) : 0;
};

const extractSkills = (text) => {
  const listedSkills = splitList(extractField(['Technical Skills', 'Skills', 'Skill Set', 'Core Skills'], text));
  const lowerText = text.toLowerCase();
  const detectedSkills = COMMON_SKILLS.filter((skill) => lowerText.includes(skill));

  return unique([...listedSkills, ...detectedSkills].map((skill) => skill.replace(/\s+/g, ' ').trim()));
};

const parsePdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text || '';
};

const parseDocx = async (buffer) => {
  const data = await mammoth.extractRawText({ buffer });
  return data.value || '';
};

const parseResume = async (file) => {
  let rawText = '';

  if (file.mimetype === SUPPORTED_TYPES.PDF) {
    rawText = await parsePdf(file.buffer);
  } else if (file.mimetype === SUPPORTED_TYPES.DOCX) {
    rawText = await parseDocx(file.buffer);
  } else {
    const error = new Error('Only PDF and DOCX resumes are supported');
    error.statusCode = 400;
    throw error;
  }

  const text = normalizeText(rawText);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const experienceYears = extractExperienceYears(text);
  const experience = extractField(['Experience', 'Work Experience', 'Professional Experience'], text)
    || (experienceYears ? `${experienceYears} years` : 'N/A');

  return {
    name: extractName(text, email),
    email,
    phone,
    contactInfo: [email, phone].filter(Boolean).join(' | ') || 'Not available',
    experience,
    experienceYears,
    location: extractField(['Location', 'Address', 'City'], text) || 'N/A',
    skills: extractSkills(text),
    projects: splitList(extractField(['Projects', 'Project Experience', 'Academic Projects'], text)),
    rawText: text,
  };
};

module.exports = { parseResume, SUPPORTED_TYPES };
