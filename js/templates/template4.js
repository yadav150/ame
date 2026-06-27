// js/templates/template4.js — final refined version matching independent HTML
function generateTemplate4PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ========== Dashed separator ==========
  function dashedSeparator() {
    return {
      canvas: [
        { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }
      ],
      margin: [0, 10, 0, 10]
    };
  }

  // ========== Section title with rounded left bar ==========
  function sectionHeader(text) {
    return {
      table: {
        widths: [ 8, '*'],   // 8px wide accent bar
        body: [[
          {
            canvas: [
              {
                type: 'rect',
                x: 0, y: 0,
                w: 8, h: 18,
                r: 4,                     // rounded all corners, left side appears rounded
                color: '#4f46e5'
              }
            ],
            margin: [0, 1, 0, 0],
            border: [false, false, false, false]
          },
          {
            text,
            bold: true,
            fontSize: 13,
            color: '#4f46e5',
            fillColor: '#f8fafc',
            margin: [6, 2, 0, 2],
            border: [false, false, false, false]
          }
        ]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 4]
    };
  }

  // ========== Personal details (two columns, simplified labels) ==========
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
          { text: l + ':', bold: true, color: '#334155', fontSize: 11 },
          { text: v, color: '#1e293b', fontSize: 11, alignment: 'right' }
        ])
      },
      layout: 'noBorders',
      margin: [0, 2, 0, 2]
    };
  }

  const personalCols = {
    columns: [
      { width: '48%', stack: [ buildPersonalTable(leftRows) ] },
      { width: '4%', text: '' },
      { width: '48%', stack: [ buildPersonalTable(rightRows) ] }
    ],
    columnGap: 0
  };

  // ========== Education table (simplified headers) ==========
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
      e.exam || '—',
      e.board || '—',
      e.year || '—',
      e.percent || '—',
      e.division || '—'
    ]);
  });

  // ========== Skills & Languages as chips ==========
  function buildTagRow(tags) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 10,
      bold: false,
      color: '#4338ca',
      fillColor: '#eef2ff',
      alignment: 'center',
      margin: [0, 0, 4, 0]
    }));
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [ cells ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 3,
        paddingBottom: () => 3,
        fillColor: () => null
      },
      margin: [0, 4, 0, 8]
    };
  }

  const skillsTags = data.skills.length ? data.skills : [];
  const langTags = data.languages.length ? data.languages : [];

  // ========== Other qualifications ==========
  const qualItems = data.qualifications.map(q => ({
    text: `${q.name || '—'} ${q.institute ? '(' + q.institute + ')' : ''}  |  ${q.year || ''}  ${q.grade ? '| ' + q.grade : ''}  ${q.duration ? '(' + q.duration + ')' : ''}`,
    margin: [0, 2]
  }));

  // ========== Declaration ==========
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // ========== Photo (rounded frame, 5px radius) ==========
  const hasPhoto = data.photo && data.photo.length > 0;
  const photoFrameCanvas = {
    canvas: [
      {
        type: 'rect',
        x: 0, y: 0,
        w: 80, h: 80,
        r: 5,                // border-radius 5px
        lineWidth: 2,
        lineColor: '#4f46e5',
        color: '#e0e7ff'     // background for placeholder
      }
    ],
    width: 80,
    height: 80
  };
  const photoContent = hasPhoto
    ? {
        stack: [
          photoFrameCanvas,
          {
            image: data.photo,
            width: 76,       // 80 - 2*2 border
            height: 76,
            margin: [2, 2, 2, 2],
            absolutePosition: { x: 56.7 + 2, y: 51 + 2 }   // approximate, may need adjustment
          }
        ]
      }
    : photoFrameCanvas;

  // Because absolutePosition is tricky, we can instead put the image inside a table cell overlay.
  // Simpler: use a table cell that contains the frame canvas and overlay the image with absolute positioning? Not ideal.
  // Alternative: draw the frame and then place the image on top using `absolutePosition` in the main content array later.
  // We'll define the header table with a column for the photo; the photo itself will be placed separately via absolutePosition if hasPhoto.
  const headerTable = {
    table: {
      widths: [80, '*'],
      body: [[
        {
          stack: [ photoFrameCanvas ],   // just the frame, photo to be added as absolute later
          width: 80,
          margin: [0, 0, 15, 0]
        },
        {
          stack: [
            { text: fullName, fontSize: 26, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
            { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 11, color: '#475569' },
            { text: `Address: ${p.address || ''}`, fontSize: 11, color: '#475569', margin: [0, 2, 0, 0] }
          ],
          margin: [0, 8, 0, 0]
        }
      ]]
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10]
  };

  // Place the actual photo as an absolute positioned element if present.
  const photoAbsolute = hasPhoto
    ? {
        image: data.photo,
        width: 76,
        height: 76,
        absolutePosition: { x: 56.7 + 2, y: 51 + 2 }
      }
    : null;

  // ========== Footer ==========
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  // ========== Assemble document ==========
  const content = [];

  // Header (and photo if any)
  content.push(headerTable);
  if (photoAbsolute) content.push(photoAbsolute);

  // Objective
  content.push(sectionHeader('OBJECTIVE'));
  content.push({ text: 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.', fontSize: 11, color: '#334155', margin: [4, 0, 0, 8] });
  content.push(dashedSeparator());

  // Personal Details
  content.push(sectionHeader('PERSONAL DETAILS'));
  content.push(personalCols);
  content.push(dashedSeparator());

  // Educational Qualification
  content.push(sectionHeader('EDUCATIONAL QUALIFICATION'));
  content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', 'auto', 'auto', 'auto'],
      body: eduBody
    },
    layout: {
      fillColor: function (i) { return i === 0 ? '#f1f5f9' : null; },
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#cbd5e1',
      vLineColor: () => '#cbd5e1',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 6,
      paddingBottom: () => 6
    }
  });
  content.push(dashedSeparator());

  // Skills
  content.push(sectionHeader('SKILLS'));
  content.push(buildTagRow(skillsTags));

  // Languages
  content.push(sectionHeader('LANGUAGES KNOWN'));
  content.push(buildTagRow(langTags));
  content.push(dashedSeparator());

  // Other Qualifications
  content.push(sectionHeader('OTHER QUALIFICATIONS'));
  content.push({ ul: qualItems.length ? qualItems : [{ text: '—', fontSize: 11 }] });
  content.push(dashedSeparator());

  // Declaration
  content.push(sectionHeader('DECLARATION'));
  content.push({ text: declarationText, fontSize: 11, italics: true, color: '#475569', margin: [4, 0, 0, 12] });

  // Footer
  content.push({
    columns: [
      { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 11 },
      {
        width: '*',
        alignment: 'right',
        stack: [
          { text: 'Date: ' + dateStr, bold: true, fontSize: 11 },
          { text: '(' + fullName + ')', bold: true, fontSize: 11, margin: [0, 4, 0, 0] }
        ]
      }
    ],
    margin: [0, 20, 0, 0]
  });

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 51, 56.7, 51],   // equal left/right ~20mm
    content: content,
    styles: {
      tableHeader: { bold: true, color: '#1e293b' }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
