// js/templates/template2.js – Elegant Header (working, matches independent HTML)
function generateTemplate2PDF(data) {
  var p = data.personal;
  var fullName = (p.fullName || 'Your Name').trim();
  var fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  var pageWidth = 595.28;
  var bandColor = '#4f46e5';
  var lightBg = '#f1f5f9';
  var borderColor = '#cbd5e1';
  var darkText = '#1e293b';
  var secondaryText = '#475569';
  var accentColor = '#4f46e5';

  // Top band
  var topBand = {
    canvas: [
      { type: 'rect', x: 0, y: 0, w: pageWidth, h: 90, color: bandColor }
    ]
  };

  // Circular photo
  var circleDiameter = 120;
  var circleX = (pageWidth - circleDiameter) / 2;
  var circleY = 30;
  var hasPhoto = data.photo && data.photo.length > 0;

  var circleBackground = {
    canvas: [
      { type: 'ellipse', x: circleX + circleDiameter/2, y: circleY + circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#ffffff' }
    ]
  };

  var photoOverlay;
  if (hasPhoto) {
    photoOverlay = {
      image: data.photo,
      width: circleDiameter - 4,
      height: circleDiameter - 4,
      absolutePosition: { x: circleX + 2, y: circleY + 2 }
    };
  } else {
    photoOverlay = {
      text: 'PHOTO',
      fontSize: 16,
      bold: true,
      color: accentColor,
      absolutePosition: { x: circleX + (circleDiameter/2) - 20, y: circleY + (circleDiameter/2) - 10 }
    };
  }

  // Header info (name + contact)
  var headerInfo = {
    stack: [
      { text: fullName, fontSize: 30, bold: true, color: darkText, alignment: 'center', margin: [0, 0, 0, 6] },
      { text: 'Email: ' + (p.email || '') + '  |  Phone: ' + (p.mobile || ''), fontSize: 13, color: secondaryText, alignment: 'center' },
      { text: 'Address: ' + (p.address || ''), fontSize: 13, color: secondaryText, alignment: 'center', margin: [0, 2, 0, 0] }
    ],
    margin: [0, circleY + circleDiameter + 10, 0, 0]  // push below photo
  };

  // Helper: section title with left accent bar
  function sectionTitle(text) {
    return {
      text: text,
      fontSize: 15,
      bold: true,
      color: darkText,
      background: lightBg,
      padding: [5, 12, 5, 12],
      margin: [0, 22, 0, 8],
      border: [true, false, false, false],
      borderWidth: [4, 0, 0, 0],
      borderColor: [accentColor, '#ffffff', '#ffffff', '#ffffff']
    };
  }

  // Helper: rounded table
  function createTable(body, widths) {
    return {
      table: {
        headerRows: 1,
        widths: widths,
        body: body
      },
      layout: {
        fillColor: function(i) { return i === 0 ? lightBg : null; },
        hLineWidth: function() { return 0.5; },
        vLineWidth: function() { return 0.5; },
        hLineColor: function() { return borderColor; },
        vLineColor: function() { return borderColor; },
        paddingLeft: function() { return 8; },
        paddingRight: function() { return 8; },
        paddingTop: function() { return 6; },
        paddingBottom: function() { return 6; }
      }
    };
  }

  // Education table
  var eduBody = [
    [
      { text: 'Exam', style: 'tableHeader' },
      { text: 'University', style: 'tableHeader' },
      { text: 'Year', style: 'tableHeader' },
      { text: 'Percentage', style: 'tableHeader' },
      { text: 'Division', style: 'tableHeader' }
    ]
  ];
  data.education.forEach(function(e) {
    eduBody.push([
      { text: e.exam || '—', fontSize: 11 },
      { text: e.board || '—', fontSize: 11 },
      { text: e.year || '—', fontSize: 11 },
      { text: e.percent || '—', fontSize: 11 },
      { text: e.division || '—', fontSize: 11 }
    ]);
  });

  // Other qualifications table
  var qualBody = [
    [
      { text: 'Qualification', style: 'tableHeader' },
      { text: 'Institute', style: 'tableHeader' },
      { text: 'Year', style: 'tableHeader' },
      { text: 'Grade', style: 'tableHeader' },
      { text: 'Duration', style: 'tableHeader' }
    ]
  ];
  data.qualifications.forEach(function(q) {
    qualBody.push([
      { text: q.name || '—', fontSize: 11 },
      { text: q.institute || '—', fontSize: 11 },
      { text: q.year || '—', fontSize: 11 },
      { text: q.grade || '—', fontSize: 11 },
      { text: q.duration || '—', fontSize: 11 }
    ]);
  });

  // Personal details (two columns)
  var personalRows = [
    ['Father', p.fatherName || '—'],
    ['Mother', p.motherName || '—'],
    ['Date of Birth', p.dob || '—'],
    ['Gender', p.gender || '—'],
    ['Marital', p.maritalStatus || '—'],
    ['Category', p.category || '—'],
    ['Experience', p.experience || '—'],
    ['Nationality', '—']
  ];
  var half = Math.ceil(personalRows.length / 2);
  var leftRows = personalRows.slice(0, half);
  var rightRows = personalRows.slice(half);

  function buildPersonalTable(rows) {
    return {
      table: {
        widths: ['*', '*'],
        body: rows.map(function(row) {
          return [
            { text: row[0] + ':', bold: true, color: '#334155', fontSize: 12 },
            { text: row[1], color: darkText, fontSize: 12, alignment: 'right' }
          ];
        })
      },
      layout: 'noBorders',
      margin: [0, 2, 0, 2]
    };
  }

  var personalCols = {
    columns: [
      { width: '48%', stack: [ buildPersonalTable(leftRows) ] },
      { width: '4%', text: '' },
      { width: '48%', stack: [ buildPersonalTable(rightRows) ] }
    ],
    columnGap: 0
  };

  // Skills / Languages chips
  function tagRow(tags) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    var cells = tags.map(function(tag) {
      return {
        text: tag,
        fontSize: 11,
        color: '#4338ca',
        fillColor: '#eef2ff',
        alignment: 'center',
        margin: [0, 0, 6, 0]
      };
    });
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [ cells ]
      },
      layout: {
        hLineWidth: function() { return 0; },
        vLineWidth: function() { return 0; },
        paddingLeft: function() { return 10; },
        paddingRight: function() { return 10; },
        paddingTop: function() { return 3; },
        paddingBottom: function() { return 3; }
      },
      margin: [0, 4, 0, 4]
    };
  }

  // Objective text
  var objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';
  var declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // Footer
  var today = new Date();
  var dateStr = today.toLocaleDateString('en-GB');
  var place = data.place || '_______________';

  var footer = {
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

  // Build main content stack
  var content = [
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

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 0, 56.7, 56.7],  // top margin 0 because we handle spacing inside, bottom margin 20mm
    content: content,
    styles: {
      tableHeader: { bold: true, color: '#0f172a', fontSize: 11 }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
