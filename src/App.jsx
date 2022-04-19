import './App.css';
import { useState } from 'react';
import { Radio, Input } from 'antd';
const Complex = require('complex.js');

const raiz3 = Math.sqrt(3);
const x10_3 = Math.pow(10, 3);
const x10_6 = Math.pow(10, 6);


const radToAng = (rad) => {
  return (rad * 180) / Math.PI;
}

const angToRad = (angle) => {
  return (angle * Math.PI ) / 180;
}

// magnitude: number
// angle: radianes
const getComplexPol = ({magnitude, angle}) => {
  try {
    if(magnitude) {
      return Complex({arg: angle, abs: magnitude})
    }
  } catch (error) {
    console.log(error);
  }
  return ''
}

const getComplexCart = ({real, img}) => {
  try {
    return Complex(real, img ?? 0)
  } catch (error) {
    console.log(error);
  }
  return ''
}

const calcIr = ({
  load,
  Fp,
  Vr
}) => {
    if(load && Fp && Vr) {
      const magnitude = (load / (raiz3 * Vr * Fp) );
      const angle = -Math.acos(Fp) // en radianes y negativo dado que está en atraso

      return getComplexPol({magnitude, angle})
    }

  return ''
}

const calclVs = ({A,B,Vr,Ir}) => {
  // Vs = AVr + BIr
  if(A && B && Vr && Ir) {
    //A * Vr
    const val1 = A.mul(Vr)
    // B * Ir
    const val2 = B.mul(Ir)
    console.log(val1, val2);
    return val1.add(val2)
  }
  return ''
}

const calcA = ({line, inpAV, inpAA}) => {
  if(inpAV) {
    return getComplexPol({
      magnitude: parseFloat(inpAV),
      angle: angToRad( // convierto de angulo a radianes
        parseFloat(inpAA || '0')
      )
    })
  } else if(line) {
    switch (line) {
      case 'corta':
        return Complex(1,0)
      case 'media':
        break;
      case 'larga':
        break;
      default:
        break;
    }
  }

  return ''
}

const calcB = ({line, inpBV, inpBA, Z}) => {
  if(inpBV) {
    return getComplexPol({
      magnitude: parseFloat(inpBV),
      angle: angToRad( // convierto de angulo a radianes
        parseFloat(inpBA || '0')
      )
    })
  } else if(line) {
    switch (line) {
      case 'corta':
        return Z;
      case 'media':
        break;
      case 'larga':
        break;
      default:
        break;
    }
  }

  return ''
}


const calcD = ({line, inpDV, inpDA, Z}) => {
  if(inpDV) {
    return getComplexPol({
      magnitude: parseFloat(inpDV),
      angle: angToRad( // convierto de angulo a radianes
        parseFloat(inpDA || '0')
      )
    })
  } else if(line) {
    switch (line) {
      case 'corta':
        return Complex(1,0);
      case 'media':
        break;
      case 'larga':
        break;
      default:
        break;
    }
  }

  return ''
}

function App() {
  // inputs
  const [line, setLine] = useState('corta');
  const [inpZR, setInpZR] = useState('');
  const [inpZI, setInpZI] = useState('');
  const [inpVsV, setInpVsV] = useState('');
  const [inpVsA, setInpVsA] = useState('0');
  const [inpVrV, setInpVrV] = useState('');
  const [inpAV, setInpAV] = useState('');
  const [inpAA, setInpAA] = useState('0');
  const [inpBV, setInpBV] = useState('');
  const [inpBA, setInpBA] = useState('0');
  const [inpDV, setInpDV] = useState('');
  const [inpDA, setInpDA] = useState('0');
  const [inpLoad, setInpLoad] = useState('');
  const [inpFP, setInpFP] = useState('0');



  // variables
  const load = parseFloat(inpLoad) * x10_6; // multiplico x10^6 para pasarlo a MV
  const Fp = parseFloat(inpFP);
  const Vr = parseFloat(inpVrV) * x10_3;

  const Z = (inpZR) ? getComplexCart({real: inpZR, img: inpZI}): '' // complejo

  const Ir = calcIr({load, Fp, Vr});

  const A = calcA({line, inpAA, inpAV});

  const B = calcB({line, inpBA, inpBV, Z})

  const D = calcD({line, inpDA, inpDV})

  const Vs = calclVs({A, B, Vr, Ir})

  return (
    <div className="App">
      <h1>Sistemas de potencia</h1>
      <div className='sub-container'>
        <section>
          <h2>Parametros de entrada</h2>
          <p>Tipos de línea</p>
          <Radio.Group onChange={(e) => {setLine(e.target.value)}} defaultValue="corta">
            <Radio.Button value="corta">Corta</Radio.Button>
            <Radio.Button value="media">Media</Radio.Button>
            <Radio.Button value="larga">Larga</Radio.Button>
          </Radio.Group>

          <p>Impedancia de la línea</p>
          <span>Real</span>
          <Input onChange={(e) => {setInpZR(e.target.value)}} placeholder="1" />
          <span>Img (i)</span>
          <Input onChange={(e) => {setInpZI(e.target.value)}} />

          <p>Vs</p>
          <span>Valor (KV)</span>
          <Input onChange={(e) => {setInpVsV(e.target.value)}} placeholder="100" />
          <span>Angulo (°)</span>
          <Input onChange={(e) => {setInpVsA(e.target.value)}} />

          <p>Vr</p>
          <span>Valor (KV)</span>
          <Input onChange={(e) => {setInpVrV(e.target.value)}} placeholder="100" />

          <p>A</p>
          <span>Valor</span>
          <Input onChange={(e) => {setInpAV(e.target.value)}} placeholder="1" />
          <span>Angulo (°)</span>
          <Input onChange={(e) => {setInpAA(e.target.value)}} value={inpAA}/>

          <p>B</p>
          <span>Valor</span>
          <Input onChange={(e) => {setInpBV(e.target.value)}} placeholder="1" />
          <span>Angulo (°)</span>
          <Input onChange={(e) => {setInpBA(e.target.value)}} value={inpBA} />

          <p>D</p>
          <span>Valor</span>
          <Input onChange={(e) => {setInpDV(e.target.value)}} placeholder="1" />
          <span>Angulo (°)</span>
          <Input onChange={(e) => {setInpDA(e.target.value)}} value={inpDA} />

          <p>Potencia de la carga</p>
          <span>Valor (MV)</span>
          <Input onChange={(e) => {setInpLoad(e.target.value)}} placeholder="100" />
          <span>FP (°)</span>
          <Input onChange={(e) => {setInpFP(e.target.value)}} value={inpFP} />
        </section>
        <section>
          <h2>Parametros de salida</h2>
          {
            !!Z && (
              <p><strong>Z linea:</strong> {Z.toString()}</p>
            )
          }
          {
            !!A && (
              <p><strong>A:</strong> {A.toString()}</p>
            )
          }
          {
            !!B && (
              <p><strong>B:</strong> {B.toString()}</p>
            )
          }
          {
            !!D && (
              <p><strong>D:</strong> {D.toString()}</p>
            )
          }
          {
            !!load && (
              <p><strong>Carga:</strong> {load.toString()} w</p>
            )
          }
          {
            !!Vr && (
              <p><strong>Vr:</strong> {Vr.toString()} V</p>
            )
          }
          {
            !!Ir && (
              <p><strong>Ir:</strong> {`${Ir.abs().toFixed(4)} _/ ${radToAng(Ir.arg()).toFixed(4)} °`} A</p>
            )
          }
          {
            !!Vs && (
              <p><strong>Vs:</strong> {`${Vs.abs().toFixed(4)} _/ ${radToAng(Vs.arg()).toFixed(4)} °`} V</p>
            )
          }
        </section>
      </div>
    </div>
  );
}

export default App;
