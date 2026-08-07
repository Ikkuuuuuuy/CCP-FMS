import sys

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>System Flowchart — 1 End Rule &amp; Flowchart Ruling</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #FAFAFA;
      color: #0F172A;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px 60px;
    }

    .title-area {
      text-align: center;
      margin-bottom: 20px;
    }
    .title-area h1 {
      font-size: 22px;
      font-weight: 800;
      color: #1E293B;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }
    .title-area p {
      font-size: 13px;
      color: #64748B;
      margin-top: 4px;
    }

    /* Symbol Legend Table */
    .legend-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .legend-table {
      border-collapse: collapse;
      font-size: 12px;
      width: 780px;
    }
    .legend-table th {
      background: #38BDF8;
      color: #FFFFFF;
      padding: 10px 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: center;
    }
    .legend-table td {
      padding: 8px 16px;
      border-bottom: 1px solid #E2E8F0;
      border-right: 1px solid #E2E8F0;
      text-align: center;
      color: #334155;
      vertical-align: middle;
    }
    .legend-table tr td:last-child {
      border-right: none;
    }
    .legend-table tr:last-child td {
      border-bottom: none;
    }

    /* Legend CSS Shapes */
    .leg-oval {
      width: 50px; height: 22px;
      border: 2px solid #0F172A;
      border-radius: 50px;
      background: #FFFFFF;
      margin: 0 auto;
    }
    .leg-arr {
      font-size: 18px;
      color: #0F172A;
    }
    .leg-para {
      width: 50px; height: 22px;
      border: 2px solid #0F172A;
      background: #FFFFFF;
      transform: skewX(-15deg);
      margin: 0 auto;
    }
    .leg-rect {
      width: 50px; height: 22px;
      border: 2px solid #0F172A;
      background: #FFFFFF;
      border-radius: 2px;
      margin: 0 auto;
    }
    .leg-diam {
      width: 18px; height: 18px;
      border: 2px solid #0F172A;
      background: #FFFFFF;
      transform: rotate(45deg);
      margin: 2px auto;
    }

    /* Canvas Card */
    .canvas-container {
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 12px;
      padding: 30px 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    svg {
      display: block;
      margin: 0 auto;
    }

    /* SVG Styling */
    .st-oval { fill: #FFFFFF; stroke: #0F172A; stroke-width: 2; }
    .st-rect { fill: #FFFFFF; stroke: #0F172A; stroke-width: 2; rx: 4; }
    .st-diam { fill: #FFFFFF; stroke: #0F172A; stroke-width: 2; }
    .st-para { fill: #FFFFFF; stroke: #0F172A; stroke-width: 2; }

    .txt-title { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800; fill: #0F172A; text-anchor: middle; dominant-baseline: middle; }
    .txt-main  { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; fill: #0F172A; text-anchor: middle; dominant-baseline: middle; }
    .txt-sub   { font-family: 'Inter', sans-serif; font-size: 9px;  font-weight: 500; fill: #64748B; text-anchor: middle; dominant-baseline: middle; }

    .lbl-yes  { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 800; fill: #16A34A; text-anchor: middle; }
    .lbl-no   { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 800; fill: #DC2626; text-anchor: middle; }
    .lbl-role { font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 700; fill: #1E293B; text-anchor: middle; }

    .line-flow { stroke: #0F172A; stroke-width: 1.75; fill: none; marker-end: url(#arrow); }
    .line-green { stroke: #16A34A; stroke-width: 1.75; fill: none; marker-end: url(#arrow-green); }
    .line-red   { stroke: #DC2626; stroke-width: 1.75; fill: none; marker-end: url(#arrow-red); }

    @media print {
      body { padding: 0; background: #fff; }
      .canvas-container { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>

<div class="title-area">
  <h1>Whole System Flowchart</h1>
  <p>Strict Flowchart Ruling &nbsp;•&nbsp; Single START &nbsp;•&nbsp; 1 END Rule &nbsp;•&nbsp; No Dead Ends</p>
</div>

<!-- Symbol Legend -->
<div class="legend-card">
  <table class="legend-table">
    <thead>
      <tr>
        <th style="width: 140px;">Symbol</th>
        <th style="width: 160px;">Name</th>
        <th>Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><div class="leg-oval"></div></td>
        <td><strong>Start / End</strong></td>
        <td>An oval represents a start or end point</td>
      </tr>
      <tr>
        <td><div class="leg-arr">&rarr;</div></td>
        <td><strong>Arrows</strong></td>
        <td>A line is a connector that shows relationships between the representative shapes</td>
      </tr>
      <tr>
        <td><div class="leg-para"></div></td>
        <td><strong>Input / Output</strong></td>
        <td>A parallelogram represents input or output</td>
      </tr>
      <tr>
        <td><div class="leg-rect"></div></td>
        <td><strong>Process</strong></td>
        <td>A rectangle represents a process</td>
      </tr>
      <tr>
        <td><div class="leg-diam"></div></td>
        <td><strong>Decision</strong></td>
        <td>A diamond indicates a decision</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="canvas-container">
<svg width="860" height="2150" viewBox="0 0 860 2150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#0F172A" />
    </marker>
    <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
    </marker>
    <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
    </marker>
  </defs>

  <!-- ================================================================= -->
  <!-- 1. AUTHENTICATION HEADER (CENTERED AT X = 430)                    -->
  <!-- ================================================================= -->

  <!-- START (Oval) -->
  <ellipse cx="430" cy="45" rx="65" ry="24" class="st-oval" />
  <text x="430" y="45" class="txt-title">START</text>

  <path d="M 430 69 L 430 100" class="line-flow" />

  <!-- LOGIN (Process Rectangle) -->
  <rect x="350" y="100" width="160" height="40" class="st-rect" />
  <text x="430" y="120" class="txt-title">LOGIN</text>

  <path d="M 430 140 L 430 170" class="line-flow" />

  <!-- Credentials valid? (Decision Diamond) -->
  <polygon points="430,170 510,205 430,240 350,205" class="st-diam" />
  <text x="430" y="200" class="txt-main">Credentials</text>
  <text x="430" y="213" class="txt-main">valid?</text>

  <!-- NO -> Display error message -> Loop to LOGIN -->
  <path d="M 350 205 L 280 205" class="line-red" />
  <text x="315" y="195" class="lbl-no">No</text>
  <rect x="145" y="185" width="135" height="40" class="st-rect" />
  <text x="212" y="200" class="txt-main">Display error</text>
  <text x="212" y="213" class="txt-main">message</text>
  <!-- Loop back to LOGIN -->
  <path d="M 212 185 L 212 120 L 350 120" class="line-flow" />

  <!-- YES -> User Role? -->
  <path d="M 430 240 L 430 270" class="line-green" />
  <text x="445" y="255" class="lbl-yes">Yes</text>

  <!-- User Role? (Decision Diamond) -->
  <polygon points="430,270 515,310 430,350 345,310" class="st-diam" />
  <text x="430" y="310" class="txt-title">User Role?</text>

  <!-- ================================================================= -->
  <!-- 2-COLUMN BRANCHING FROM USER ROLE:                                -->
  <!-- LEFT COLUMN (X = 220): Admin / IT Staff                           -->
  <!-- RIGHT COLUMN (X = 640): Employee / End User                       -->
  <!-- ================================================================= -->

  <!-- Branch Left -> Admin / IT Staff -->
  <path d="M 345 310 L 220 310 L 220 380" class="line-flow" />
  <text x="275" y="300" class="lbl-role">Admin / IT Staff</text>

  <!-- Branch Right -> Employee / End User -->
  <path d="M 515 310 L 640 310 L 640 380" class="line-flow" />
  <text x="585" y="300" class="lbl-role">Employee / End User</text>


  <!-- ================================================================= -->
  <!-- LEFT COLUMN: ADMIN / IT STAFF (X = 220)                           -->
  <!-- ================================================================= -->

  <!-- L1: Open Admin/Staff Dashboard -->
  <rect x="125" y="380" width="190" height="40" class="st-rect" />
  <text x="220" y="400" class="txt-main">Open Admin/Staff Dashboard</text>

  <path d="M 220 420 L 220 450" class="line-flow" />

  <!-- L2: View Asset and Request Records (Input/Output Parallelogram) -->
  <polygon points="120,450 330,450 315,490 105,490" class="st-para" />
  <text x="212" y="470" class="txt-main">View Asset and Request Records</text>

  <path d="M 220 490 L 220 520" class="line-flow" />

  <!-- L3: Review Repair / Issue Request -->
  <rect x="125" y="520" width="190" height="40" class="st-rect" />
  <text x="220" y="540" class="txt-main">Review Repair / Issue Request</text>

  <path d="M 220 560 L 220 590" class="line-flow" />

  <!-- L4: Check Request Details Complete? (Decision Diamond) -->
  <polygon points="220,590 305,625 220,660 135,625" class="st-diam" />
  <text x="220" y="619" class="txt-main">Check Request</text>
  <text x="220" y="632" class="txt-main">Details Complete?</text>

  <!-- L4 - NO -> Request More Info / Return to User -->
  <path d="M 135 625 L 70 625" class="line-red" />
  <text x="100" y="615" class="lbl-no">No</text>
  <rect x="-65" y="605" width="135" height="40" class="st-rect" />
  <text x="2" y="619" class="txt-main">Request More Information /</text>
  <text x="2" y="632" class="txt-main">Return to User</text>
  <!-- Loop back to L3 -->
  <path d="M 2 605 L 2 540 L 125 540" class="line-flow" />

  <!-- L4 - YES -> Inspect Asset / Diagnose Issue -->
  <path d="M 220 660 L 220 690" class="line-green" />
  <text x="235" y="675" class="lbl-yes">Yes</text>

  <!-- L5: Inspect Asset / Diagnose Issue -->
  <rect x="125" y="690" width="190" height="40" class="st-rect" />
  <text x="220" y="710" class="txt-main">Inspect Asset / Diagnose Issue</text>

  <path d="M 220 730 L 220 760" class="line-flow" />

  <!-- L6: Can issue be solved quickly? (Decision Diamond) -->
  <polygon points="220,760 310,800 220,840 130,800" class="st-diam" />
  <text x="220" y="794" class="txt-main">Can issue be</text>
  <text x="220" y="807" class="txt-main">solved quickly?</text>

  <!-- L6 - NO -> Schedule Maintenance / Escalate Repair -->
  <path d="M 130 800 L 70 800 L 70 870 L 130 870" class="line-red" />
  <text x="100" y="790" class="lbl-no">No</text>
  <rect x="0" y="850" width="130" height="40" class="st-rect" />
  <text x="65" y="864" class="txt-main">Schedule Maintenance /</text>
  <text x="65" y="877" class="txt-main">Escalate Repair</text>
  <path d="M 130 870 L 220 870" class="line-flow" />

  <!-- L6 - YES -> Perform Repair / Provide Support -->
  <path d="M 310 800 L 370 800 L 370 870 L 310 870" class="line-green" />
  <text x="340" y="790" class="lbl-yes">Yes</text>
  <rect x="310" y="850" width="130" height="40" class="st-rect" />
  <text x="375" y="864" class="txt-main">Perform Repair /</text>
  <text x="375" y="877" class="txt-main">Provide Support</text>
  <path d="M 310 870 L 220 870" class="line-flow" />

  <!-- Merge point L7: Update Request Status -->
  <path d="M 220 840 L 220 900" class="line-flow" />

  <rect x="125" y="900" width="190" height="40" class="st-rect" />
  <text x="220" y="920" class="txt-main">Update Request Status</text>

  <path d="M 220 940 L 220 970" class="line-flow" />

  <!-- L8: Update Asset / Maintenance Records -->
  <rect x="125" y="970" width="190" height="40" class="st-rect" />
  <text x="220" y="990" class="txt-main">Update Asset / Maintenance Records</text>

  <path d="M 220 1010 L 220 1040" class="line-flow" />

  <!-- L9: Notify User -->
  <rect x="125" y="1040" width="190" height="40" class="st-rect" />
  <text x="220" y="1060" class="txt-main">Notify User</text>

  <path d="M 220 1080 L 220 1110" class="line-flow" />

  <!-- L10: Close Request -->
  <rect x="125" y="1110" width="190" height="40" class="st-rect" />
  <text x="220" y="1130" class="txt-main">Close Request</text>

  <path d="M 220 1150 L 220 1180" class="line-flow" />

  <!-- L11: Logout (Left Track) -->
  <rect x="125" y="1180" width="190" height="40" class="st-rect" />
  <text x="220" y="1200" class="txt-title">Logout</text>

  <!-- Connect Left Logout to Bottom Single END -->
  <path d="M 220 1220 L 220 1780 L 430 1780" class="line-flow" />


  <!-- ================================================================= -->
  <!-- RIGHT COLUMN: EMPLOYEE / END USER (X = 640)                        -->
  <!-- ================================================================= -->

  <!-- R1: Open User Dashboard -->
  <rect x="545" y="380" width="190" height="40" class="st-rect" />
  <text x="640" y="400" class="txt-main">Open User Dashboard</text>

  <path d="M 640 420 L 640 450" class="line-flow" />

  <!-- R2: View Assigned Asset / Asset Info (Input/Output Parallelogram) -->
  <polygon points="535,450 755,450 740,490 520,490" class="st-para" />
  <text x="632" y="470" class="txt-main">View Assigned Asset / Asset Information</text>

  <path d="M 640 490 L 640 520" class="line-flow" />

  <!-- R3: Issue or Repair Needed? (Decision Diamond) -->
  <polygon points="640,520 725,555 640,590 555,555" class="st-diam" />
  <text x="640" y="549" class="txt-main">Issue or Repair</text>
  <text x="640" y="562" class="txt-main">Needed?</text>

  <!-- R3 - NO -> Continue Using Asset -> Logout -> SINGLE END -->
  <path d="M 725 555 L 780 555" class="line-red" />
  <text x="750" y="545" class="lbl-no">No</text>
  <rect x="780" y="535" width="130" height="40" class="st-rect" />
  <text x="845" y="555" class="txt-main">Continue Using Asset</text>
  <!-- Path down to right side logout -->
  <path d="M 845 575 L 845 1180 L 735 1180" class="line-flow" />

  <!-- R3 - YES -> Submit Repair Request / Report Issue -->
  <path d="M 640 590 L 640 620" class="line-green" />
  <text x="655" y="605" class="lbl-yes">Yes</text>

  <!-- R4: Submit Repair Request / Report Issue -->
  <rect x="545" y="620" width="190" height="40" class="st-rect" />
  <text x="640" y="640" class="txt-main">Submit Repair Request / Report Issue</text>

  <path d="M 640 660 L 640 690" class="line-flow" />

  <!-- R5: Enter Issue Details (Input/Output Parallelogram) -->
  <polygon points="545,690 745,690 730,730 530,730" class="st-para" />
  <text x="632" y="710" class="txt-main">Enter Issue Details</text>

  <path d="M 640 730 L 640 760" class="line-flow" />

  <!-- R6: System Validates Submission -->
  <rect x="545" y="760" width="190" height="40" class="st-rect" />
  <text x="640" y="780" class="txt-main">System Validates Submission</text>

  <path d="M 640 800 L 640 830" class="line-flow" />

  <!-- R7: Request Complete? (Decision Diamond) -->
  <polygon points="640,830 725,865 640,900 555,865" class="st-diam" />
  <text x="640" y="860" class="txt-main">Request</text>
  <text x="640" y="873" class="txt-main">Complete?</text>

  <!-- R7 - NO -> Revise / Resubmit Request -->
  <path d="M 725 865 L 780 865" class="line-red" />
  <text x="750" y="855" class="lbl-no">No</text>
  <rect x="780" y="845" width="130" height="40" class="st-rect" />
  <text x="845" y="865" class="txt-main">Revise / Resubmit Request</text>
  <!-- Loop back to R6 System Validates Submission -->
  <path d="M 845 845 L 845 780 L 735 780" class="line-flow" />

  <!-- R7 - YES -> Request Sent to IT Staff -->
  <path d="M 640 900 L 640 930" class="line-green" />
  <text x="655" y="915" class="lbl-yes">Yes</text>

  <!-- R8: Request Sent to IT Staff -->
  <rect x="545" y="930" width="190" height="40" class="st-rect" />
  <text x="640" y="950" class="txt-main">Request Sent to IT Staff</text>

  <path d="M 640 970 L 640 1000" class="line-flow" />

  <!-- R9: Track Request Status -->
  <rect x="545" y="1000" width="190" height="40" class="st-rect" />
  <text x="640" y="1020" class="txt-main">Track Request Status</text>

  <path d="M 640 1040 L 640 1070" class="line-flow" />

  <!-- R10: Receive Notifications / Resolution Updates (Parallelogram) -->
  <polygon points="530,1070 760,1070 745,1110 515,1110" class="st-para" />
  <text x="632" y="1090" class="txt-main">Receive Notifications / Resolution Updates</text>

  <path d="M 640 1110 L 640 1140" class="line-flow" />

  <!-- R11: Issue Resolved? (Decision Diamond) -->
  <polygon points="640,1140 725,1175 640,1210 555,1175" class="st-diam" />
  <text x="640" y="1170" class="txt-main">Issue</text>
  <text x="640" y="1183" class="txt-main">Resolved?</text>

  <!-- R11 - NO -> Follow Up / Reopen Request -->
  <path d="M 725 1175 L 780 1175" class="line-red" />
  <text x="750" y="1165" class="lbl-no">No</text>
  <rect x="780" y="1155" width="130" height="40" class="st-rect" />
  <text x="845" y="1175" class="txt-main">Follow Up / Reopen Request</text>
  <!-- Loop back to R10 Receive Notifications -->
  <path d="M 845 1155 L 845 1090 L 745 1090" class="line-flow" />

  <!-- R11 - YES -> Logout -->
  <path d="M 640 1210 L 640 1240" class="line-green" />
  <text x="655" y="1225" class="lbl-yes">Yes</text>

  <!-- R12: Logout (Right Track) -->
  <rect x="545" y="1240" width="190" height="40" class="st-rect" />
  <text x="640" y="1260" class="txt-title">Logout</text>

  <!-- Connect Right Logout to Bottom Single END -->
  <path d="M 640 1280 L 640 1780 L 430 1780" class="line-flow" />


  <!-- ================================================================= -->
  <!-- STRICT 1 END RULE (SINGLE CONVERGED OVAL AT BOTTOM AT X = 430)    -->
  <!-- ================================================================= -->

  <path d="M 430 1780 L 430 1820" class="line-flow" />

  <!-- SINGLE END (Oval) -->
  <ellipse cx="430" cy="1845" rx="65" ry="24" class="st-oval" style="stroke-width: 2.5;" />
  <text x="430" y="1845" class="txt-title" style="font-size: 13px;">END</text>

</svg>
</div>

</body>
</html>
"""

with open(r'C:\\Users\\Wayne\\.gemini\\antigravity-ide\\scratch\\ccp-fms\\system-flowchart.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Whole system flowchart updated successfully.")
