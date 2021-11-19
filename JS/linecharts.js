
// define the dimensions and margins for the graph
    var margin = {top: 30, right: 200, bottom: 40, left: 80};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 1;

// define function to parse time in years format    
    var formatTime = d3.timeParse("%Y-%m-%d")
    var st = d3.timeFormat("%b %y")
// create scales x & y for X and Y axis and set their ranges
    var x = d3.scaleTime()
        .range([0,width]);


    var y = d3.scaleLinear()
        .range([height,0]);
    var y3 =d3.scaleSqrt()
        .range([height,0]);
    var y4 = d3.scaleLog()
        .range([height,0]);

// append svg element to the body of the page
// set dimensions and position of the svg element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var svg2 = d3.select("#chart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var svg3 = d3.select("#chart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var svg4 = d3.select("#chart4")
        .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Get the data
    var pathToCsv = "boardgame_ratings.csv";

    var dataset = d3.csv("boardgame_ratings.csv")
    dataset.then(function (data) 
        {        
            var slices = data.columns.slice(1).map(function(id) 
            {
                return {
                    id: id,
                    values: data.map(function(d){
                        return {
                            date: d.date,
                            measurement: +d[id]
                        }
                    })
                }
            
            });
            console.log('s',slices) 
            // removing the rank columns  
                var datarank = slices.filter(function (d,i){
                    
                    return i%2 ==0;}) 
                var withrank =slices.filter(function(d,i) {
                    return i%2 !==0  })
            //changing the column names    
                var test = datarank.forEach(function(d,i) {
                    
                    d["id"] = d["id"].split("=")[0]
                    d["values"]=d["values"]
                    
                    })

            console.log('d',datarank)
            console.log('dd',slices)


        // set the domains of X and Y scales based on data

            var minDate = d3.min(data, d => formatTime(d.date))
            var maxDate = d3.max(data, d => formatTime(d.date))
            var numDate = maxDate-minDate
    
            x.domain(d3.extent(data,function(d){return formatTime(d.date)}));

            y.domain([0,d3.max(data,function(d){return d["Catan=count"]})]);
            y3.domain([0,d3.max(data,function(d){return d["Catan=count"]})]);
        
            y4.domain([1e-6,1e+5])
            
            z = d3.scaleOrdinal(d3.schemeCategory10)
    


            var xAxis= d3.axisBottom()
                        .scale(x)
                        .ticks(numDate)
                        .ticks(d3.timeMonth.every(3))
                        .tickFormat(d3.timeFormat("%b %y"))
                    
            var yAxis = d3.axisLeft()
                        .scale(y)  
                        .ticks(10)
            var yAxis3 = d3.axisLeft()
                        .scale(y3)  
                        .ticks(10)
            var yAxis4 = d3.axisLeft()
                        .scale(y4)  
                        .ticks(10)


   
        //Lines for chart 1 nd 2//////////////////////////////////////////
            var line = d3.line()
                .x(function(d) { return x(formatTime(d.date)); })
                .y(function(d) { return y(+d.measurement); });
            
            var lines = svg.selectAll("lines")
                .data(datarank)
                .enter()
                .append("g");

            lines.append("path")
                .attr("d", function(d) { return line(d.values); })
                .attr("stroke-width", 1)
                .style("fill","none")
                .style("stroke", function(d) { return z(d.id); });

            var lines2 = svg2.selectAll("lines")
                .data(datarank)
                .enter()
                .append("g")
                .attr('class','line');
            
            lines2.append("path")
                .attr("d", function(d) { return line(d.values); })
                .attr("stroke-width", 1)
                .style("fill","none")
                .style("stroke", function(d) { return z(d.id); });

            //filters for circle
            newlines = lines2.filter(function(d,i){ if( i==0||i==2||i==3||i==4){ return d}})            
            newlines.selectAll("circles")  
                    .data(function(d) { return d.values})
                .enter()
                .append("circle")     
                .filter(function(d,i){ return(i+1)%3 ==0})           
                .attr("class", "dot")     
                .attr("cx", function(d) { return x(formatTime(d.date))})
                .attr("cy", function(d) {return y(+d.measurement);})
                .attr("r", 10)
                .style("fill", function(d){return z(this.parentNode.__data__.id)})
                .style("stroke", function(d){return z(this.parentNode.__data__.id)})

            //appending rank..................................
            var rank = svg2.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Catan=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y(+d['Catan=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg2.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Codenames=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y(+d['Codenames=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg2.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Terraforming Mars=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y(+d['Terraforming Mars=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg2.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Gloomhaven=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y(+d['Gloomhaven=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

      

        //Lines for chart 3 sqrt //////////////////////////////////////////    
            var line3 = d3.line()
                    .x(function(d) { return x(formatTime(d.date)); })
                    .y(function(d) { return y3(+d.measurement); });
                
            var lines3 = svg3.selectAll("lines")
                        .data(datarank)
                        .enter()
                        .append("g");

            lines3.append("path")
                        .attr("d", function(d) { return line3(d.values); })
                        .attr("stroke-width", 1)
                        .style("fill","none")
                        .style("stroke", function(d) { return z(d.id); });

            //filters for circle
            newlines = lines3.filter(function(d,i){ if( i==0||i==2||i==3||i==4){ return d}})            
            newlines.selectAll("circles")  
                    .data(function(d) { return d.values})
                .enter()
                .append("circle")     
                .filter(function(d,i){ return(i+1)%3 ==0})           
                .attr("class", "dot")     
                .attr("cx", function(d) { return x(formatTime(d.date))})
                .attr("cy", function(d) {return y3(+d.measurement);})
                .attr("r", 10)
                .style("fill", function(d){return z(this.parentNode.__data__.id)})
                .style("stroke", function(d){return z(this.parentNode.__data__.id)})

            //appending rank..................................
            var rank = svg3.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Catan=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y3(+d['Catan=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg3.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Codenames=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y3(+d['Codenames=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg3.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Terraforming Mars=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y3(+d['Terraforming Mars=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg3.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Gloomhaven=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y3(+d['Gloomhaven=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")



        ////Lines for chart 4- log //////////////////////////////////////////    
            var line4 = d3.line()
                .x(function(d) { return x(formatTime(d.date)); })
                .y(function(d) { return y4(+d.measurement); });
            
            var lines4 = svg4.selectAll("lines")
                .data(datarank)
                .enter()
                .append("g");

            lines4.append("path")
                .attr("d", function(d) { return line4(d.values); })
                .attr("stroke-width", 1)
                .style("fill","none")
                .style("stroke", function(d) { return z(d.id); });

            //filters for circle
            newlines = lines4.filter(function(d,i){ if( i==0||i==2||i==3||i==4){ return d}})            
            newlines.selectAll("circles")  
                    .data(function(d) { return d.values})
                .enter()
                .append("circle")     
                .filter(function(d,i){ return(i+1)%3 ==0})           
                .attr("class", "dot")     
                .attr("cx", function(d) { return x(formatTime(d.date))})
                .attr("cy", function(d) {return y4(+d.measurement);})
                .attr("r", 10)
                .style("fill", function(d){return z(this.parentNode.__data__.id)})
                .style("stroke", function(d){return z(this.parentNode.__data__.id)})

            //appending rank..................................
            var rank = svg4.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Catan=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y4(+d['Catan=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg4.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Codenames=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y4(+d['Codenames=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg4.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Terraforming Mars=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y4(+d['Terraforming Mars=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")

            var rank = svg4.selectAll("rank")
                .data(data).enter().append("text")
                .filter(function(d,i){ return (i+1)%3 ==0})
                .text(function(d) { return d['Gloomhaven=rank'];})
                .attr('x', function(d){return x(formatTime(d.date));})
                .attr("y",function(d){return  y4(+d['Gloomhaven=count'])+2;})
                .attr('font-size', 8)
                .attr('fill','white')
                .style("text-anchor", "middle")


        //creating lines label graph1///////////////////////////////////////////////////////////
            lines.append("text")
                .attr("class","line_label")
                .datum(function(d)
                {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]
                        }
                        
                })
                
                .attr("transform", function(d) {
                        return "translate(" + (x(formatTime(d.value.date)) + 10)  
                        + "," + (y(+d.value.measurement) + 5 ) + ")";})
                .attr("x", 5)
                .text(function(d) { return d.id; })
                .style("stroke", function(d) { return z(d.id); });
        //creating lines label graph2///////
            lines2.append("text")
                .attr("class","line_label")
                .datum(function(d) 
                {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]}
                        
                })
                
                    .attr("transform", function(d) {
                            return "translate(" + (x(formatTime(d.value.date)) + 10)  
                            + "," + (y(+d.value.measurement) + 5 ) + ")";})
                .attr("x", 5)
                .text(function(d) { return d.id; })
                .style("stroke", function(d) { return z(d.id); });
        //creating lines label graph3///////
            lines3.append("text")
                .attr("class","line_label")
                .datum(function(d) 
                {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]}
                        
                })

                .attr("transform", function(d) {
                        return "translate(" + (x(formatTime(d.value.date)) + 10)  
                        + "," + (y3(+d.value.measurement) + 5 ) + ")";})
                .attr("x", 5)
                .text(function(d) { return d.id; })
                .style("stroke", function(d) { return z(d.id); });
        //creating lines label graph4///////
            lines4.append("text")
                .attr("class","line_label")
                .datum(function(d) 
                {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]}
                        
                })

                .attr("transform", function(d) {
                        return "translate(" + (x(formatTime(d.value.date)) + 10)  
                        + "," + (y4(+d.value.measurement) + 5 ) + ")";})
                .attr("x", 5)
                .text(function(d) { return d.id; })
                .style("stroke", function(d) { return z(d.id); });
                    


        //first graph////////////////////////////////////
            // Add the Y Axis................................
            svg.append("g")
                .attr("id", "y_axis")     
                .call(yAxis)
                .attr();
            svg.append("text")
                .attr("id","y_axis_label")
                .attr("transform", "rotate(-90)")
                .text("Num of Ratings")
                .attr('text-anchor', 'middle')
                .attr("x",0 - (height / 2))
                .attr("y",-60 );

            // Add the X Axis............................
                svg.append("g")
                .attr("id", "x_axis")
                .call(xAxis)
                .attr("transform", "translate(0," + height + ")");
            svg.append("text")
                .attr("id", "x_axis_label")
                .text("Month")
                .attr('y', height+margin.bottom)
                .attr('x',width/2)
                .attr('text-anchor', 'middle') ;  
            svg.append("text")
                .attr("id","title")
                .attr("x",250)
                .attr("y",0)
                .text("Number of Ratings 2016-2020");

        //secondgraph//////////////////////////////////////

            // Add the Y Axis
            svg2.append("g")
                .attr("id", "y_axis")     
                .call(yAxis)
                .attr();
            svg2.append("text")
                .attr("id","y_axis_label")
                .attr("transform", "rotate(-90)")
                .text("Num of Ratings")
                .attr('text-anchor', 'middle')
                .attr("x",0 - (height / 2))
                .attr("y",-60 );

            // Add the X Axis
            svg2.append("g")
                .attr("id", "x_axis")
                .call(xAxis)
                .attr("transform", "translate(0," + height + ")");
            svg2.append("text")
                .attr("id", "x_axis_label")
                .text("Month")
                .attr('y', height+margin.bottom)
                .attr('x',width/2)
                .attr('text-anchor', 'middle') ;  
            svg2.append("text")
                .attr("id","title")
                .attr("x",250)
                .attr("y",0)
                .text("Number of Ratings 2016-2020 with Rankings");
            svg2.append("text")
                .attr("id","legend")
                .attr("x",700)
                .attr("y",height+margin.bottom)
                .text("BoardGameGeek Rank")
                .style("font-size",12)

            svg2.append("circle")
                .attr("cx",750)
                .attr("cy",height+margin.bottom-25)
                .attr("r", 15)
                .style("fill", "black")
            svg2.append("text")
                .attr("id","legend")
                .attr("x",741)
                .attr("y",height+margin.bottom-23)
                .text("Rank")
                .style("font-size",9)
                .style("fill","white")
        //3rd graph//////////////////////////////////////

            // Add the Y Axis
            svg3.append("g")
                .attr("id", "y_axis")     
                .call(yAxis3)
                .attr();
            svg3.append("text")
                .attr("id","y_axis_label")
                .attr("transform", "rotate(-90)")
                .text("Num of Ratings")
                .attr('text-anchor', 'middle')
                .attr("x",0 - (height / 2))
                .attr("y",-60 );

            // Add the X Axis
            svg3.append("g")
                .attr("id", "x_axis")
                .call(xAxis)
                .attr("transform", "translate(0," + height + ")");
            svg3.append("text")
                .attr("id", "x_axis_label")
                .text("Month")
                .attr('y', height+margin.bottom)
                .attr('x',width/2)
                .attr('text-anchor', 'middle') ;  
            svg3.append("text")
                .attr("id","title")
                .attr("x",200)
                .attr("y",0)
                .text("Number of Ratings 2016-2020 (Square root Scale)");
            svg3.append("text")
                .attr("id","legend")
                .attr("x",700)
                .attr("y",height+margin.bottom)
                .text("BoardGameGeek Rank")
                .style("font-size",12)
            svg3.append("circle")
                .attr("cx",750)
                .attr("cy",height+margin.bottom-25)
                .attr("r", 15)
                .style("fill", "black")
            svg3.append("text")
                .attr("id","legend")
                .attr("x",741)
                .attr("y",height+margin.bottom-23)
                .text("Rank")
                .style("font-size",9)
                .style("fill","white")

            //4th graph//////////////////////////////////////

            // Add the Y Axis
            svg4.append("g")
                .attr("id", "y_axis")     
                .call(yAxis4)
                .attr();
            svg4.append("text")
                .attr("id","y_axis_label")
                .attr("transform", "rotate(-90)")
                .text("Num of Ratings")
                .attr('text-anchor', 'middle')
                .attr("x",0 - (height / 2))
                .attr("y",-60 );

            // Add the X Axis
            svg4.append("g")
                .attr("id", "x_axis")
                .call(xAxis)
                .attr("transform", "translate(0," + height + ")");
            svg4.append("text")
                .attr("id", "x_axis_label")
                .text("Month")
                .attr('y', height+margin.bottom)
                .attr('x',width/2)
                .attr('text-anchor', 'middle') ;  
            svg4.append("text")
                .attr("id","title")
                .attr("x",200)
                .attr("y",-15)
                .text("Number of Ratings 2016-2020 (Log Scale)");
            svg4.append("text")
                .attr("id","legend")
                .attr("x",700)
                .attr("y",height+margin.bottom-20)
                .text("BoardGameGeek Rank")
                .style("font-size",12)
            svg4.append("circle")
                .attr("cx",750)
                .attr("cy",height+margin.bottom-50)
                .attr("r", 15)
                .style("fill", "black")
            svg4.append("text")
                .attr("id","legend")
                .attr("x",741)
                .attr("y",height+margin.bottom-47)
                .text("Rank")
                .style("font-size",9)
                .style("fill","white")
            svg4.append("text")
                .attr("id","credit")
                .attr("x",710)
                .attr("y",height+margin.bottom)
                .text("cmodi9")
                .style("font-size",15)

        })
        