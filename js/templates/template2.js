// js/templates/template2.js – Elegant Header (fully fixed, matches original design)
function generateTemplate2PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ---------- 1. Circular photo cropping (client side) ----------
  function cropToCircle(base64) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = base64;
    });
  }

  // ---------- 2. Generate PDF after photo is ready ----------
  async function buildPDF() {
    let photoBase64 = data.photo || '';
    if (photoBase64 && photoBase64.startsWith('data:image')) {
      photoBase64 = await cropToCircle(photoBase64);
    }

    const pageWidth = 595.28;
    const bandColor = '#4f46e5';
    const lightBg = '#f1f5f9';
    const borderColor = '#cbd5e1';
    const darkText = '#1e293b';
    const secondaryText = '#475569';
    const accentColor = '#4f46e5';

    // Top band
    const topBand = {
      canvas: [{ type: 'rect', x: 0, y: 0, w: pageWidth, h: 90, color: bandColor }]
    };

    // Circular photo frame
    const circleDiameter = 120;
    const circleX = (pageWidth - circleDiameter) / 2;
    const circleY = 30;
    const hasPhoto = photoBase64 && photoBase64.length > 0;

    const circleBackground = {
      canvas: [
        { type: 'ellipse', x: circleX + circleDiameter / 2, y: circleY + circleDiameter / 2, r1: circleDiameter / 2, r2: circleDiameter / 2, color: '#ffffff' }
      ]
    };

    let photoOverlay;
    if (hasPhoto) {
      // The photo is now perfectly circular
      photoOverlay = {
        image: photoBase64,
        width: circleDiameter,
        height: circleDiameter,
        absolutePosition: { x: circleX, y: circleY }
      };
    } else {
      photoOverlay = {
        text: 'PHOTO',
        fontSize: 16,
        bold: true,
        color: accentColor,
        absolutePosition: { x: circleX + (circleDiameter / 2) - 20, y: circleY + (circleDiameter / 2) - 10 }
      };
    }

    // Header info (name + contact)
    const headerInfo = {
      stack: [
        { text: fullName, fontSize: 30, bold: true, color: darkText, alignment: 'center', margin: [0, 0, 0, 6] },
        { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 13, color: secondaryText, alignment: 'center' },
        { text: `Address: ${p.address || ''}`, fontSize: 13, color: secondaryText, alignment: 'center', margin: [0, 2, 0, 0] }
      ],
      margin: [0, circleY + circleDiameter + 10, 0, 0]   // 160pt from top
    };

    // ---------- 3. Section title with left accent bar ----------
    function sectionTitle(text) {
      return {
        text,
        fontSize: 15,
        bold: true,
        color: darkText,
        background: lightBg,
        padding: [5, 12, 5, 12],
        margin: [0, 18, 0, 6],
        border: [true, false, false, false],
        borderWidth: [4, 0, 0, 0],
        borderColor: [accentColor, '#ffffff', '#ffffff', '#ffffff']
      };
    }

    // ---------- 4. Rounded table helper ----------
    function createTable(body, widths) {
      return {
        table: {
          headerRows: 1,
          widths,
          body
        },
        layout: {
          fillColor: (i) => i === 0 ? lightBg : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => borderColor,
          vLineColor: () => borderColor,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 6,
          paddingBottom: () => 6
        }
      };
    }

    // Education table
    const eduBody = [
      [
        { text: 'Exam', style: 'tableHeader' },
        { text: 'University', style: 'tableHeader' },
        { text: 'Year', style: 'tableHeader' },
        { text: 'Percentage', style: 'tableHeader' },
        { text: 'Division', style: 'tableHeader' }
      ]
    ];
    data.education.forEach(e => {
      eduBody.push([
        { text: e.exam || '—', fontSize: 11 },
        { text: e.board || '—', fontSize: 11 },
        { text: e.year || '—', fontSize: 11 },
        { text: e.percent || '—', fontSize: 11 },
        { text: e.division || '—', fontSize: 11 }
      ]);
    });

    // Other qualifications table
    const qualBody = [
      [
        { text: 'Qualification', style: 'tableHeader' },
        { text: 'Institute', style: 'tableHeader' },
        { text: 'Year', style: 'tableHeader' },
        { text: 'Grade', style: 'tableHeader' },
        { text: 'Duration', style: 'tableHeader' }
      ]
    ];
    data.qualifications.forEach(q => {
      qualBody.push([
        { text: q.name || '—', fontSize: 11 },
        { text: q.institute || '—', fontSize: 11 },
        { text: q.year || '—', fontSize: 11 },
        { text: q.grade || '—', fontSize: 11 },
        { text: q.duration || '—', fontSize: 11 }
      ]);
    });

    // Personal details (two columns)
    const personalRows = [
      ['Father', p.fatherName || '—'],
      ['Mother', p.motherName || '—'],
      ['Date of Birth', p.dob || '—'],
      ['Gender', p.gender || '—'],
      ['Marital', p.maritalStatus || '—'],
      ['Category', p.category || '—'],
      ['Experience', p.experience || '—'],
      ['Nationality', '—']
    ];
    const half = Math.ceil(personalRows.length / 2);
    const leftRows = personalRows.slice(0, half);
    const rightRows = personalRows.slice(half);

    function buildPersonalTable(rows) {
      return {
        table: {
          widths: ['*', '*'],
          body: rows.map(([l, v]) => [
            { text: l + ':', bold: true, color: '#334155', fontSize: 12 },
            { text: v, color: darkText, fontSize: 12, alignment: 'right' }
          ])
        },
        layout: 'noBorders',
        margin: [0, 2, 0, 2]
      };
    }

    const personalCols = {
      columns: [
        { width: '48%', stack: [buildPersonalTable(leftRows)] },
        { width: '4%', text: '' },
        { width: '48%', stack: [buildPersonalTable(rightRows)] }
      ],
      columnGap: 0
    };

    // Skills / Languages chips
    function tagRow(tags) {
      if (!tags.length) return { text: '—', fontSize: 11 };
      const cells = tags.map(tag => ({
        text: tag,
        fontSize: 11,
        color: '#4338ca',
        fillColor: '#eef2ff',
        alignment: 'center',
        margin: [0, 0, 6, 0]
      }));
      return {
        table: {
          widths: Array(tags.length).fill('auto'),
          body: [cells]
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 3,
          paddingBottom: () => 3
        },
        margin: [0, 4, 0, 4]
      };
    }

    const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';
    const declarationText = data.declaration
      ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
      : '';

    // Footer
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB');
    const place = data.place || '_______________';

    const footer = {
      columns: [
        { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 12 },
        {
          width: '*',
          alignment: 'right',
          stack: [
            { text: 'Date: ' + dateStr, bold: true, fontSize: 12 },
            { text: '(' + fullName + ')', bold: true, fontSize: 12, margin: [0, 4, 0, 0] }
          ]
        }
      ],
      margin: [0, 25, 0, 0]
    };

    // ---------- 5. Assemble content ----------
    const content = [
      topBand,
      circleBackground,
      photoOverlay,
      headerInfo,

      sectionTitle('OBJECTIVE'),
      { text: objectiveText, fontSize: 12, color: secondaryText, lineHeight: 1.5, margin: [0, 0, 0, 12] },

      sectionTitle('PERSONAL DETAILS'),
      personalCols,

      sectionTitle('EDUCATIONAL QUALIFICATION'),
      createTable(eduBody, ['*', '*', 'auto', 'auto', 'auto']),

      sectionTitle('SKILLS'),
      tagRow(data.skills),

      sectionTitle('LANGUAGES KNOWN'),
      tagRow(data.languages),

      sectionTitle('OTHER QUALIFICATIONS'),
      createTable(qualBody, ['*', '*', 'auto', 'auto', 'auto']),

      sectionTitle('DECLARATION'),
      {
        text: declarationText,
        fontSize: 11,
        italics: true,
        color: '#64748b',
        margin: [0, 0, 0, 15],
        border: [true, false, false, false],
        borderWidth: [3, 0, 0, 0],
        borderColor: [borderColor, '#ffffff', '#ffffff', '#ffffff'],
        paddingLeft: 10
      },

      footer
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [56.7, 0, 56.7, 56.7],
      content,
      styles: {
        tableHeader: { bold: true, color: '#0f172a', fontSize: 11 }
      },
      defaultStyle: { font: 'Roboto' }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  }

  // Run the async PDF generation
  buildPDF().catch(err => {
    console.error(err);
    alert('Failed to generate PDF. Please check the console for details.');
  });
}
