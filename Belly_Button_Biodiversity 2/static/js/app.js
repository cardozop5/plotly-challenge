function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (Mydata) {

    // Use d3 to select the panel with id of `#sample-metadata`
    let MysampleMetaData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
    MysampleMetaData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(Mydata).forEach(([key, value])=> {

      // Hint: Inside the loop, you will need to use d3 to append new
      MysampleMetaData.append("h6").text(`${key}:${value}`);
    });
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });

};

function buildCharts(sample) {


  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((Mydata)=>{
    let MyOtu_ids=Mydata.otu_ids;
    let MyOtu_labels=Mydata.otu_labels;
    let MySample_values=Mydata.sample_values;
  // @TODO: Build a Bubble Chart using the sample data
    let B_Chart =[{
      x:MyOtu_ids,
      y:MySample_values,
      mode:'markers',
      text:MyOtu_labels,
      marker: {
        color:MyOtu_ids,
        size:MySample_values,
        colorscale:'Rainbow' 
      }
    }];

    let B_Chart_Layout ={
      title: 'OTU ID',
      margin: {t:0}
    };

    Plotly.plot('bubble', B_Chart, B_Chart_Layout);

  // @TODO: Build a Pie Chart
    let P_Chart =[{
      type:'pie',
      values:MySample_values.slice(0,10),
      labels:MyOtu_ids.slice(0,10),
      hovertext:MyOtu_labels.slice(0,10),
      hoverinfo:'hovertext',
      colorscale:'Rainbow'

    }];

    let layout={
      margin:{t:0, l:0}
    };

    Plotly.plot('pie', P_Chart, layout);
  });  

  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
