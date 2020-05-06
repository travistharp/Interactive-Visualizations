// build dropdown menu
function init() { 
  var dropdown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
      console.log(data)
      data.names.forEach((name) => {
          dropdown.append("option").text(name).property("value");
      });

      buildPlot(data.names[0]);
      metaData(data.names[0]);
  });
}

init();


// build the bar plot and bubble plot
function buildPlot(id) {
  d3.json("samples.json").then((data)=> {
      console.log(data)

      var wfreq = data.metadata.filter(m => m.wfreq === id)[0];
      console.log(wfreq);
      
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      console.log(samples);

      // top 10 otus
      var samplevalues = samples.sample_values.slice(0, 10).reverse();
      var otuTop = (samples.otu_ids.slice(0, 10)).reverse();
      
      var otuID = otuTop.map(id => "OTU " + id)
      console.log(otuID)

      var labels = samples.otu_labels.slice(0, 10);

      var trace1 = {
          x: samplevalues,
          y: otuID,
          text: labels,
          marker: {
            color: '#d2ebab'},
          type:"bar",
          orientation: "h",
      };

      var data = [trace1];

      // bar layout
      var layoutBar = {
          title: "Subject "+id+" Top 10 OTUs",
          yaxis:{tickmode:"linear"},
          height: 500,
          width: 1000,
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // bar plot
      Plotly.newPlot("bar", data, layoutBar);

    
      // bubble plot
      var trace2 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.sample_values,
              colorscale: "Earth"
          },
          text: samples.otu_labels

      };

      // bubble plot layout
      var layoutBubble = {
          xaxis:{title: "Subject "+id+" OTU IDs"},
          height: 600,
          width: 1000
      };

      var data1 = [trace2];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layoutBubble); 



      // Washing frequency

      var data2 = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: "Subject "+id+" Weekly Washing Frequency" },
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
                 steps: [
                  { range: [0, 2], color: "#536349" },
                  { range: [2, 4], color: "#607a4e" },
                  { range: [4, 6], color: "#73ab4f" },
                  { range: [6, 8], color: "#78c445" },
                  { range: [8, 9], color: "#62eb07" },
                ]}
            
        }
      ];
      var layout_g = { 
          width: 700, 
          height: 600, 
          margin: { t: 20, 
                    b: 40, 
                    l:100, 
                    r:100 
                  } 
        };
      Plotly.newPlot("gauge", data2, layout_g);
    });
}  


// data for the demographic panel
function metaData(id) {

  d3.json("samples.json").then((data)=> {
      
      var metadata = data.metadata;

      console.log(metadata)

      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      var demographicInfo = d3.select("#sample-metadata");
      
      //empty the panel and populate with the info
      demographicInfo.html("");
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}
metadata(id);

function optionChanged(id) {
  buildPlot(id);
  metaData(id);
}
