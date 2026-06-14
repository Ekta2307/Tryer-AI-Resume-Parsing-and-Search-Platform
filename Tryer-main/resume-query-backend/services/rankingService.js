const tokenize = (value = '') => value
  .toString()
  .toLowerCase()
  .replace(/[^a-z0-9+#. ]/g, ' ')
  .split(/\s+/)
  .filter((token) => token.length > 1);

const buildCandidateText = (resume) => [
  resume.name,
  resume.location,
  resume.experience,
  ...(resume.skills || []),
  ...(resume.projects || []),
].join(' ');

const calculateTfIdfScores = (resumes, queryTerms) => {
  if (!queryTerms.length) {
    return resumes.map((resume) => ({ ...resume, matchScore: 0 }));
  }

  const documents = resumes.map((resume) => tokenize(buildCandidateText(resume)));
  const totalDocuments = documents.length || 1;

  return resumes.map((resume, index) => {
    const doc = documents[index];
    const score = queryTerms.reduce((sum, term) => {
      const termCount = doc.filter((token) => token === term || token.includes(term)).length;
      const tf = doc.length ? termCount / doc.length : 0;
      const docsContainingTerm = documents.filter((tokens) => (
        tokens.some((token) => token === term || token.includes(term))
      )).length || 1;
      const idf = Math.log((totalDocuments + 1) / (docsContainingTerm + 1)) + 1;
      return sum + tf * idf;
    }, 0);

    return {
      ...resume,
      matchScore: Math.min(100, Math.round(score * 1000)),
    };
  });
};

const rankResumes = (resumes, filters) => {
  const queryTerms = tokenize([
    filters.q,
    filters.name,
    filters.location,
    filters.experience,
    filters.skills,
  ].filter(Boolean).join(' '));

  return calculateTfIdfScores(resumes, queryTerms)
    .sort((a, b) => b.matchScore - a.matchScore || new Date(b.createdAt) - new Date(a.createdAt));
};

module.exports = { rankResumes };
