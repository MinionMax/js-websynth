//Master Synth Engine
var notes = ["C", "D", "E", "F", "G", "A", "B"]//available note
const synth = new Tone.Synth().toDestination();//creates new synth instrument
var html = ""
var OCTset = 2

var octaveButtons = new Nexus.RadioButton(
    document.querySelector(".octave-controls"),{
    'size': [120,25],
    'numberOfButtons': 5,
    'active': 2
})

octaveButtons.on('change',function(n) {
    OCTset = n
    console.log(n)
    if(n === -1){
        n = 2
        octaveButtons.select(2)
        console.log("octave can't be undefined")
    }
})

octaveButtons.colorize("accent", "#18c947" )
octaveButtons.colorize("fill", "rgb(229, 229, 229)" )

//set max amount of octaves
for (var octave = 0; octave < 2; octave++)
{
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        var hasSharp = true;
        
        //eliminate E# and B# keys
        if (note === "E" || note === "B"){
            hasSharp = false;
        }
        //create white key class within keyboard container
        html += `<div class="whitenote"
            onmousedown = "noteDown(this, false)"
            onmouseleave = "noteUp(this, false)"
            ontouchstart = "noteDown(this, false)"
            ontouchend = "noteUp(this, false)"
            data-note="${note + (octave + Number(OCTset))}">`;
        //create black key class within keyboard container
        if (hasSharp){
            html += `<div class="blacknote"
            onmousedown = "noteDown(this, true)"
            onmouseleave = "noteUp(this, true)"
            ontouchstart = "noteDown(this, false)"
            ontouchend = "noteUp(this, false)"
            data-note="${note + "#" + (octave + OCTset)}"></div>`;
        }
        
        html += `</div>`
    }
}

document.getElementById("keyboard").innerHTML = html;

function noteDown(elem, isSharp){
    var note = elem.dataset.note;
    elem.style.background = isSharp ? "rgb(78, 78, 78)" : "#ccc";
    synth.triggerAttackRelease(note);
    event.stopPropagation();
}

function noteUp(elem, isSharp){
    elem.style.background = isSharp ? "rgb(158, 158, 158)" : "none"
    synth.triggerRelease();
}

var OSCbuttons = document.getElementsByClassName("oscbuttons")
for(let div of OSCbuttons) {
    div.onclick = (activeOSC) => {
        for(let notactiveOSC of OSCbuttons) {
            if(notactiveOSC != activeOSC.target) {
                notactiveOSC.dataset.active = false;
                activeOSC.target.dataset.active = true;
                
                switch(activeOSC.target.name){
                    case "sine":
                        synth.oscillator.type = "sine";
                    break;
                    case "saw":
                        synth.oscillator.type ="sawtooth";
                    break;
                    case "triangle":
                        synth.oscillator.type ="triangle";
                    break;
                    case "square":
                        synth.oscillator.type ="square";
                    break;
                }
                console.log("OSC has been set to:", activeOSC.target.name);
            }
        }
      
    }
}


var envelopeSlider = document.getElementById("envelope-sliders")        
envelopeSlider.oninput = function(event){
    switch(event.target.id){
        case "attack-slider":
            synth.envelope.attack = event.target.value; 
        break;
        case "decay-slider":
            synth.envelope.decay = event.target.value; 
        break;
        case "sustain-slider":
            synth.envelope.sustain = Number(event.target.value)/100; 
        break;
        case "release-slider":
            synth.envelope.release = event.target.value; 
        break;
    }
}

Nexus.context = Tone.getContext().rawContext._nativeAudioContext
var oscilloscope = new Nexus.Oscilloscope(
    document.querySelector('.oscilloscope'),
    { 'size': [150,75] 
}) 
oscilloscope.connect(Tone.Destination._internalChannels[1]._nativeAudioNode)
oscilloscope.colorize("accent", "#18c947" )
oscilloscope.colorize("fill", "rgb(229, 229, 229)" )



var filterDial = new Nexus.Dial(
    document.querySelector(".filter"),{
    'size': [75,75],
    'interaction': 'radial', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 20000,
    'step': 0,
    'value': 0
})

var filterValue = new Nexus.Number(
    document.querySelector(".filter-value")
)
filterValue.link(filterDial)
filterDial.colorize("accent", "#18c947")
const filter = new Tone.Filter(filterDial.value, "lowpass").toDestination();
synth.connect(filter)

var meter = new Nexus.Meter(
    document.querySelector(".meter"),{
    size: [25,70]
})
meter.connect(Tone.Destination._internalChannels[1]._nativeAudioNode)
meter.colorize("accent", "#18c947" )
meter.colorize("fill", "rgb(229, 229, 229)" )

var volumeSlider = new Nexus.Slider(
    document.querySelector(".vol2"),{
    'size': [10, 70],
    'mode': 'relative',  // 'relative' or 'absolute'
    'min': -50,
    'max': 4,
    'step': 0,
    'value': 0,
})

volumeSlider.on('change',function(value) {
    synth.volume.value = value
})

volumeSlider.colorize("accent", "#18c947" )
volumeSlider.colorize("fill", "rgb(158, 158, 158)")