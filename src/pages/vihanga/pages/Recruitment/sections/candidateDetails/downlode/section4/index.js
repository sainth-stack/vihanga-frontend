import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import img from '../../../../../../../../assets/images/pytest.png';
import bgimg1 from '../../../../../../../../assets/images/bgimg1.png';
import bgimg2 from '../../../../../../../../assets/images/bgimg2.png';
import bgimg3 from '../../../../../../../../assets/images/bgimg3.png';
import vihanga from '../../../../../../../../assets/images/vihanga.png';
import bgimge from '../../../../../../../../assets/svg/bg-tile.svg';

const Section4 = ({ data, candidateDetails }) => {
  const [chartValues, setChartValues] = React.useState([0, 0, 0]);
  const [profileType, setProfileType] = React.useState('');

  React.useEffect(() => {
    if (data?.results) {
      const results = data.results;
      const total =
        results.ImplementationSpecialists +
        results.RealWorlders +
        results.DisruptiveInnovator;

      const implementationSpecialistValue = total
        ? ((results.ImplementationSpecialists / total) * 100).toFixed(1)
        : 0;
      const realWorlderValue = total
        ? ((results.RealWorlders / total) * 100).toFixed(1)
        : 0;
      const disruptiveInnovatorValue = total
        ? ((results.DisruptiveInnovator / total) * 100).toFixed(1)
        : 0;

      const values = [
        parseFloat(implementationSpecialistValue),
        parseFloat(realWorlderValue),
        parseFloat(disruptiveInnovatorValue),
      ];

      setChartValues(values);
      determineProfileType(values);
    }
  }, [data]);

  const determineProfileType = (values) => {
    const [implementation, realWorld, disruptive] = values;
    
    // Create array with values and their categories for sorting
    const categories = [
      { value: disruptive, name: 'Disruptive' },
      { value: realWorld, name: 'RealWorld' },
      { value: implementation, name: 'Implementation' }
    ];
    
    // Sort by value in descending order
    categories.sort((a, b) => b.value - a.value);
    
    // Balanced profile check - all three values should be truly similar to each other
    const maxDiff = Math.max(...values) - Math.min(...values);
    const tolerance = 2; // Maximum 2% difference between highest and lowest values
    
    if (maxDiff <= tolerance) {
      setProfileType('balanced');
      return;
    }

    // Check for exact equal pairs
    if (Math.abs(disruptive - realWorld) === 0 && Math.abs(disruptive - implementation) !== 0) {
      setProfileType('equalDisruptiveRealWorld');
      return;
    }
    if (Math.abs(disruptive - implementation) === 0 && Math.abs(disruptive - realWorld) !== 0) {
      setProfileType('equalDisruptiveImplementation');
      return;
    }
    if (Math.abs(realWorld - implementation) === 0 && Math.abs(realWorld - disruptive) !== 0) {
      setProfileType('equalRealWorldImplementation');
      return;
    }

    // Assign levels based on relative positions
    const levels = {};
    levels[categories[0].name] = 'high';    // Highest value
    levels[categories[1].name] = 'medium';  // Middle value
    levels[categories[2].name] = 'low';     // Lowest value

    // Standard combinations
    setProfileType(`${levels.Disruptive}Disruptive-${levels.RealWorld}RealWorld-${levels.Implementation}Implementation`);
  };

  const getContent = () => {
    const candidateName = candidateDetails?.candidateName || '[Candidate Name]';
    
    switch(profileType) {
      case 'highDisruptive-mediumRealWorld-lowImplementation':
        return {
          title: `Candidates with a high Disruptive innovator Score, Medium Real worlder`,
          description: `${candidateName} displays a high Disruptive Innovator score, a medium Real Worlder score, and a low Implementation Specialist score. This suggests they thrive in strategic, transformative roles like Product Development, Innovation Management, or Strategic Planning. They're great at generating big ideas and identifying new opportunities—but may require support when it comes to execution. They're structured, detail-oriented, and focused on outcomes. While they may not be the most risk-loving or unconventional, their strength lies in optimizing systems and translating ideas into clear strategies—perfect for roles that value structured innovation.`
        };
      case 'highDisruptive-lowRealWorld-mediumImplementation':
        return {
          title: `Candidates with a high Disruptive innovator Score, Low Real worlder, Medium Implementation Specialist`,
          description: `${candidateName} has a high Disruptive Innovator score, a low Real Worlder score, and a medium Implementation Specialist score. They excel in roles like Research & Development, Business Strategy, or Innovation Consulting. These candidates are visionary, future-focused, and thrive when they're challenging the status quo with bold, unconventional ideas. They're not always focused on tangible outcomes or hands-on execution—but they shine in high-level strategy, creative problem-solving, and concept development. Great for environments where innovation and strategic disruption are key.`
        };
      case 'mediumDisruptive-highRealWorld-lowImplementation':
        return {
          title: `Candidates with a Medium Disruptive innovator Score, High Real worlder`,
          description: `${candidateName} shows a medium Disruptive Innovator score, a high Real Worlder score, and a low Implementation Specialist score. They're a great fit for roles in Business Analytics, Operations Strategy, or Policy Analysis. They combine practical thinking with creative yet feasible solutions, and they thrive when working hands-on with real-world problems. While they may not always focus on execution efficiency, they bring grounded, action-oriented insights to the table—ideal for structured roles that require data-driven decision-making.`
        };
      case 'mediumDisruptive-lowRealWorld-highImplementation':
        return {
          title: `Candidates with a Medium Disruptive innovator Score, Low Real worlder, High Implementation Specialist`,
          description: `${candidateName} presents a medium Disruptive Innovator score, a low Real Worlder score, and a high Implementation Specialist score. They're well-suited for roles like Technical Project Management, Operations Execution, or Process Optimization. They excel in structured, outcome-driven environments, and are highly efficient when it comes to turning ideas into results. While they may not be naturally hands-on or focused on practicality, they bring precision, organization, and a strong drive for execution—perfect for roles where structure and efficiency are essential.`
        };
      case 'lowDisruptive-highRealWorld-mediumImplementation':
        return {
          title: `Candidates with a Low Disruptive innovator Score, High Real worlder`,
          description: `${candidateName} has a low Disruptive Innovator score, a high Real Worlder score, and a medium Implementation Specialist score. They're reliable, practical, and hands-on—ideal for roles like Operational Management, Logistics Coordination, or Financial Analysis. These individuals excel in structured environments and are focused on tangible, measurable outcomes. They may not lean into innovation or risk-taking, but they're consistent, grounded, and thrive in roles that prioritize stability, efficiency, and clear execution.`
        };
      case 'lowDisruptive-mediumRealWorld-highImplementation':
        return {
          title: `Candidates with a Low Disruptive innovator Score, Medium Real worlder, High Implementation Specialist`,
          description: `${candidateName} holds a low Disruptive Innovator score, a medium Real Worlder score, and a high Implementation Specialist score. They're excellent in roles such as Process Engineering, Quality Control, or Supply Chain Management. With strong execution skills and operational efficiency, they are dependable and results-driven. Innovation may not be their strong suit, but they shine in structured, process-oriented environments where precision, discipline, and follow-through are valued.`
        };
      case 'balanced':
        return {
          title: `Balanced Profile Across All Attributes`,
          description: `${candidateName} shows balanced scores across Disruptive Innovator, Real Worlder, and Implementation Specialist attributes. This makes them a highly adaptable and versatile contributor, well-suited for roles such as Management Consulting, Product Management, Business Operations, or Organizational Leadership. Their unique ability to blend creativity, practicality, and execution allows them to operate effectively across diverse challenges.`
        };
      case 'equalDisruptiveRealWorld':
        return {
          title: `Equal Disruptive Innovator and Real Worlder Scores`,
          description: `${candidateName} has equal Disruptive Innovator and Real Worlder scores, with a differing Implementation Specialist score. If their Disruptive Innovator and Real Worlder scores are higher, they may excel in roles like Strategic Advisory, Innovation Research, or Business Analysis—where creativity and practical thinking are equally valued. If their Implementation Specialist score is higher, they are likely to thrive in more structured roles like Operations Management, Process Improvement, or Project Execution, where precision and execution are key.`
        };
      case 'equalDisruptiveImplementation':
        return {
          title: `Equal Disruptive Innovator and Implementation Specialist Scores`,
          description: `${candidateName} presents equal Disruptive Innovator and Implementation Specialist scores, with a differing Real Worlder score. If the Disruptive Innovator and Implementation Specialist scores are higher, they're ideal for roles in R&D Leadership, Product Development, or Transformation Strategy—bringing together vision and execution. If their Real Worlder score is higher, they are better suited for grounded, data-driven roles such as Operations Strategy, Market Research, or Applied Analytics.`
        };
      case 'equalRealWorldImplementation':
        return {
          title: `Equal Real Worlder and Implementation Specialist Scores`,
          description: `${candidateName} shows equal Real Worlder and Implementation Specialist scores, with a differing Disruptive Innovator score. If the Real Worlder and Implementation Specialist scores are higher, they'll shine in Business Operations, Supply Chain Management, or Process Optimization—bringing structure and efficiency to the forefront. If their Disruptive Innovator score is higher, they're a strong fit for Innovation Strategy, Change Management, or Product Strategy—roles that need both execution capability and the courage to challenge the status quo.`
        };
      default:
        return {
          title: `Candidate Profile Analysis`,
          description: `The assessment results for ${candidateName} show a unique combination of Disruptive Innovator, Real Worlder, and Implementation Specialist attributes. This distinctive profile suggests they would thrive in roles that leverage their specific strengths across innovation, practical application, and execution capabilities.`
        };
    }
  };

  const content = getContent();

  return (
    <Box
      id="print-container"
      sx={{
        width: "210mm", // A4 width
        height: "297mm", // A4 height
        padding: "15mm", // safe print area
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        backgroundImage: `url(${bgimge})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "50% auto",
        backgroundPosition: "100% center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={4} sx={{ flex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: 'Montserrat',
                fontSize: '24px',
                color: '#0E0E0E',
                width: "100%",
                mb: 2,
              }}
            >
              {content.title}
            </Typography>

            {/* Centered Image */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img 
                src={img} 
                alt="center visual" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  maxHeight: '180px' 
                }} 
              />
            </Box>

            {/* Description Text */}
            <Typography sx={{ 
              fontFamily: 'Work Sans', 
              fontSize: '14px', 
              color: '#0E0E0E', 
              lineHeight: 1.6,
              mb: 2
            }}>
              {content.description}
            </Typography>
          </Grid>

          {/* Right Side Decorative Images */}
          {/* <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'flex-end',
                height: '100%',
                justifyContent: 'center'
              }}
            >
              <img src={bgimg1} alt="bg1" style={{ maxWidth: '80%' }} />
              <img src={bgimg2} alt="bg2" style={{ maxWidth: '80%' }} />
              <img src={bgimg3} alt="bg3" style={{ maxWidth: '80%' }} />
            </Box>
          </Grid> */}
        </Grid>
        
        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <img 
            src={vihanga} 
            alt="vihanga img" 
            style={{ 
              width: '106px', 
              height: '25px',
              objectFit: 'contain'
            }} 
          />
          <Typography sx={{ 
            fontFamily: "Work Sans", 
            fontWeight: "500", 
            fontSize: "16px", 
            color: "#0E0E0E",
            pr: 3
          }}>
            04
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Section4;