// Define a global variable to hold the URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Set up function to draw bar graph
function drawBar(sampleId) {

// Get the data ....  
  d3.json(url).then(data => {
        
    let samples = data.samples;
  
     // Filter the data based on a sample id
    let resultArray = samples.filter(s => s.id == sampleId);
    let result = resultArray[0];

    // Set up variables for the sample data to be used in graph
    // data sliced to get top ten results and reversed for Plottlys prefered order
    let otu_ids = result.otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    let otu_labels = result.otu_labels.slice(0,10).reverse();
    let sample_values = result.sample_values.slice(0,10).reverse();

    // Create a trace object for bar graph using variables from above
    let barData = {
      x: sample_values,
      y: otu_ids,
      type: 'bar',
      text: otu_labels,
      orientation: 'h'
    };

    // Put the trace object into an array
    let barArray = [barData];

    // Create a layout object
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30, l: 100}
    };

    // Call the Plotly function
    Plotly.newPlot('bar', barArray, barLayout);
  });
}

// Set up function to draw bubble graph
function drawBubble(sampleId) {
  
  // Get the data ....  
  d3.json(url).then(data => {
    
    let samples = data.samples;
    
    // Filter the data based on a sample id
    let resultArray = samples.filter(s => s.id == sampleId);
    let result = resultArray[0];
  
    // Set up variables for the sample data to be used in graph
    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;

    // Create a trace object for bubble graph using variables from above
    let traceBubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
            color: otu_ids,
            size: sample_values
          }
    };
    // Put the trace object into an array
    let dataBubble = [traceBubble];

    // Create a layout object
    let layoutBubble = {
      title: 'Bacteria Cultures Per Sample',
      margin: {t: 30},
      hovermode: 'closest',
      xaxis: {title: "OTU ID"},
    };
    // Call the Plotly function
    Plotly.newPlot('bubble', dataBubble, layoutBubble);
  });
}
  
// Set up Demographic Info
function showDemographic(sampleId) {
  
  // Collect metadata
  d3.json(url).then((data) => {  
      // Filter data
      let result = data.metadata.filter(meta => meta.id == sampleId)[0];
      let demographicInfo = d3.select('#sample-metadata');

      // Clear existing data in demographicInfo
      demographicInfo.html('');

      // Add key and value pair to the demographicInfo panel
      Object.entries(result).forEach(([key, value]) => {
          demographicInfo.append('h6').text(`${key}: ${value}`);
      });
  });
}

// Function to handle change in selection of sample Id
let selector = d3.select('#selDataset').on("change", updateDashboard);

function updateDashboard() {
  
  d3.json(url).then(data => {
      
      let sampleNames = data.names;

      // Add sample ids to the dropdown
      for (let i = 0; i < data.names.length; i++) {
          let sampleId = data.names[i];
          selector.append('option').text(sampleId).property('value', sampleId);
      };
      // Read the current value from the dropdown
      let sampleId = selector.property('value');
      
      // Show the diplays for the selected sample id
      drawBar(sampleId);
      drawBubble(sampleId);
      showDemographic(sampleId);
      
  });
}

updateDashboard();



