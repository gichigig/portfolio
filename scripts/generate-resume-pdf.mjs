import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const TOP_START = 750;
const BOTTOM_LIMIT = 44;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const toPdfSafeText = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const estimateTextWidth = (text, fontSize) => text.length * fontSize * 0.52;

const wrapText = (text, fontSize, maxWidth) => {
  const words = text.trim().split(/\s+/);

  if (words.length === 0) {
    return [];
  }

  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (estimateTextWidth(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (!currentLine) {
      lines.push(candidate);
      currentLine = "";
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const loadResumeData = () => {
  const resumeTsPath = path.join(projectRoot, "data", "resume.ts");
  const source = fs.readFileSync(resumeTsPath, "utf8");

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
    fileName: resumeTsPath,
    reportDiagnostics: true,
  });

  if (transpiled.diagnostics?.length) {
    const diagnostics = transpiled.diagnostics
      .map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n"))
      .join("\n");
    throw new Error(`TypeScript transpile diagnostics:\n${diagnostics}`);
  }

  const moduleObject = { exports: {} };
  const sandbox = {
    module: moduleObject,
    exports: moduleObject.exports,
    require,
    __dirname: path.dirname(resumeTsPath),
    __filename: resumeTsPath,
    console,
  };

  vm.runInNewContext(transpiled.outputText, sandbox, {
    filename: resumeTsPath,
  });

  const resolved = moduleObject.exports.resumeData;

  if (!resolved) {
    throw new Error("Could not resolve resumeData from data/resume.ts");
  }

  return resolved;
};

const buildContentStream = (resumeData) => {
  const contentWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  const commands = [];
  let y = TOP_START;

  const addLine = (text, options = {}) => {
    const {
      x = MARGIN_LEFT,
      fontSize = 10.5,
      lineHeight = 13,
      uppercase = false,
    } = options;

    const normalized = uppercase ? text.toUpperCase() : text;
    commands.push("BT");
    commands.push(`/F1 ${fontSize.toFixed(2)} Tf`);
    commands.push(`1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`);
    commands.push(`(${toPdfSafeText(normalized)}) Tj`);
    commands.push("ET");
    y -= lineHeight;
  };

  const addWrapped = (text, options = {}) => {
    const {
      x = MARGIN_LEFT,
      fontSize = 10.5,
      lineHeight = 13,
      maxWidth = contentWidth,
      uppercase = false,
    } = options;

    for (const line of wrapText(text, fontSize, maxWidth)) {
      addLine(line, { x, fontSize, lineHeight, uppercase });
    }
  };

  const addSectionTitle = (title) => {
    y -= 5;
    addLine(title, { fontSize: 11.8, lineHeight: 14.8, uppercase: true });
  };

  const addRule = () => {
    commands.push("0.5 w");
    commands.push(
      `${MARGIN_LEFT.toFixed(2)} ${y.toFixed(2)} m ${(PAGE_WIDTH - MARGIN_RIGHT).toFixed(2)} ${y.toFixed(2)} l S`,
    );
    y -= 10;
  };

  const { contact } = resumeData;

  addLine(contact.name, { fontSize: 21, lineHeight: 17 });
  addLine(contact.title, { fontSize: 12, lineHeight: 15 });
  addWrapped(`${contact.location} | ${contact.phone} | ${contact.email}`, {
    fontSize: 10.3,
    lineHeight: 12.5,
  });
  addWrapped(`GitHub: ${contact.github}`, {
    fontSize: 10.1,
    lineHeight: 12.2,
  });
  addWrapped(`LinkedIn: ${contact.linkedin}`, {
    fontSize: 10.1,
    lineHeight: 12.2,
  });

  addRule();

  addSectionTitle("Professional Summary");
  addWrapped(resumeData.summary, {
    fontSize: 10.4,
    lineHeight: 12.8,
  });

  addSectionTitle("Skills");
  for (const group of resumeData.skillGroups) {
    addWrapped(`${group.label}: ${group.items.join(", ")}`, {
      fontSize: 10.1,
      lineHeight: 12.4,
    });
  }

  addSectionTitle("Experience");
  for (const experience of resumeData.experiences) {
    addWrapped(
      `${experience.role} | ${experience.company} | ${experience.period}`,
      {
        fontSize: 10.4,
        lineHeight: 12.8,
      },
    );

    for (const bullet of experience.bullets) {
      addWrapped(`- ${bullet}`, {
        x: MARGIN_LEFT + 8,
        maxWidth: contentWidth - 8,
        fontSize: 10,
        lineHeight: 12.2,
      });
    }
  }

  addSectionTitle("Education");
  for (const education of resumeData.education) {
    addWrapped(
      `${education.credential}, ${education.institution} (${education.graduationYear})`,
      {
        fontSize: 10.3,
        lineHeight: 12.8,
      },
    );
  }

  addSectionTitle("Selected Projects");
  for (const project of resumeData.projects) {
    addWrapped(`- ${project.title} (${project.stack}): ${project.bullet}`, {
      x: MARGIN_LEFT + 8,
      maxWidth: contentWidth - 8,
      fontSize: 9.9,
      lineHeight: 12.1,
    });
  }

  if (y < BOTTOM_LIMIT) {
    throw new Error(
      `Resume content overflowed one page. Lowest y-position: ${y.toFixed(2)}.`,
    );
  }

  return `${commands.join("\n")}\n`;
};

const buildPdf = (contentStream) => {
  const objects = [];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`,
  );
  objects.push(
    `4 0 obj\n<< /Length ${Buffer.byteLength(contentStream, "binary")} >>\nstream\n${contentStream}endstream\nendobj\n`,
  );
  objects.push(
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  );

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "binary");
};

const main = () => {
  const resumeData = loadResumeData();
  const stream = buildContentStream(resumeData);
  const pdfBuffer = buildPdf(stream);
  const outputPath = path.join(projectRoot, "public", "resume.pdf");

  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`Generated resume PDF at ${outputPath}`);
};

main();
