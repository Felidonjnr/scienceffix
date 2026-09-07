const fs = require('fs');
const path = require('path');

const files = ['physics.ts', 'chemistry.ts', 'biology.ts', 'math.ts'];
const skills = ['Spatial Reasoning', 'Formula Dependency', 'Graph Illiteracy', 'Reading Comprehension', 'Logical Deduction', 'Conceptual Application'];

files.forEach(file => {
  const filepath = path.join(__dirname, 'src/data', file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  content = content.replace(/topic: '([^']+)',/g, (match, topic) => {
    const diff = Math.floor(Math.random() * 3) + 1;
    const skill1 = skills[Math.floor(Math.random() * skills.length)];
    const skill2 = skills[Math.floor(Math.random() * skills.length)];
    const uniqSkills = [...new Set([skill1, skill2])];
    return `topic: '${topic}', cognitiveSkills: ${JSON.stringify(uniqSkills)}, difficulty: ${diff},`;
  });
  
  fs.writeFileSync(filepath, content);
});
console.log("Done");
