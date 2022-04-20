import './App.css';
import { useState } from 'react';
import { Radio, Input } from 'antd';
const Complex = require('complex.js');


Math.Sin = function(w){
  return parseFloat(Math.sin(w).toFixed(10));
};

Math.Cos = function(w){
  return parseFloat(Math.cos(w).toFixed(10));
};

const raiz3 = Math.sqrt(3);
const x10_3 = Math.pow(10, 3);
const x10_6 = Math.pow(10, 6);


function radToAng(rad) {
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
    if(real || img){
      return Complex(real || 0, img || 0)
    }
  } catch (error) {
    console.log(error);
  }
  return ''
}

const calcIr = ({
  load,
  Fp,
  Vr,
  Is,
  inpIrA,
  inpIrV
}) => {
  if (inpIrV) {
    return getComplexPol({
      magnitude: parseFloat(inpIrV),
      angle: angToRad(inpIrA || '0')
    })
  } else if(Is) {
    return Is
  } else if(load && Fp && Vr) {
      const magnitude = (load / (raiz3 * Vr * Fp) );
      const angle = -Math.acos(Fp) // en radianes y negativo dado que está en atraso

      return getComplexPol({magnitude, angle})
    }

  return ''
}

const calclVs = ({A,B,Vr,Ir, inpVsA, inpVsV}) => {
  if(inpVsV){
    return getComplexPol({
      magnitude: parseFloat(inpVsV) * x10_3,
      angle: angToRad(inpVsA || '0')
    })
  } else if(A && B && Vr && Ir) {
    // Vs = AVr + BIr

    //A * Vr
    const val1 = A.mul((Vr/raiz3))
    // B * Ir
    const val2 = B.mul(Ir)
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
        return ''
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

const calcD = ({line, inpDV, inpDA}) => {
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

const calcDelta = ({ Vs, Vr, Ps, A, B, D, inpVsA}) => {
  // valido si digitaron un angulo cuando Vs tiene valor
  // en caso tal devuelvo el angulo ingresado
  if (Vs && inpVsA) {
    return inpVsA;
  } else if (Ps && Vr && A && B && D) {
    // Calculo el angulo a partir de la ecuación de Ps
    // val1 = |D||Vs|^2 / |B| * cos(β - α)
    const val1 = ((D.abs() * Math.pow(Vs.abs(), 2))/ B.abs()) * Math.Cos(B.arg() - A.arg())
    // val2 = |Vs||Vr| / |B|
    const val2 = (Vs.abs() * Vr)/ B.abs()
    const val3 = (val1 - Ps) / val2;
    // val4 = β - cos^-1 (val3)
    const val4 = Math.acos(val3) - B.arg();
    return radToAng(val4)
  }
  return ''
};

const calcPs = ({inpPs}) => {
  if(inpPs) {
    return parseFloat(inpPs)
  }
  return ''
}

const calcPr = ({inpPr}) => {
  if(inpPr) {
    return parseFloat(inpPr)
  }
  return ''
}

const calcQs = ({inpQs}) => {
  if(inpQs) {
    return parseFloat(inpQs)
  }
  return ''
}

const calcQr = ({inpQr}) => {
  if(inpQr) {
    return parseFloat(inpQr)
  }
  return ''
}

const calcIs = ({Ir, D, B, Vs, Vr}) => {
  if (Ir) {
    return Ir;
  } else if(D && B && Vs && Vr) {
    return (D.mul(Vs).sub(Vr)).div(B)
  }
  return ''
}

const calcVr = ({inpVrV, Vs, B, Ir, A}) => {
  console.log(inpVrV, Vs, B, Ir, A);
  if(inpVrV) {
    return parseFloat(inpVrV) * x10_3
  } else if (Vs && B && Ir && A) {
    // Vr = (Vs - BIR ) / A
    console.log('calcVr', (Vs.sub(B.mul(Ir))).div(A));
    return ((Vs.sub(B.mul(Ir))).div(A)).abs()
  }
  return ''
}

function App() {
  // inputs
  const [line, setLine] = useState('corta');
  const [inpZR, setInpZR] = useState('');
  const [inpZI, setInpZI] = useState('');
  const [inpVsV, setInpVsV] = useState('');
  const [inpVsA, setInpVsA] = useState('');
  const [inpVrV, setInpVrV] = useState('');
  const [inpAV, setInpAV] = useState('');
  const [inpAA, setInpAA] = useState('');
  const [inpBV, setInpBV] = useState('');
  const [inpBA, setInpBA] = useState('');
  const [inpDV, setInpDV] = useState('');
  const [inpDA, setInpDA] = useState('');
  const [inpLoad, setInpLoad] = useState('');
  const [inpFP, setInpFP] = useState('');
  const [inpPr, setInpPr] = useState('');
  const [inpQr, setInpQr] = useState('');
  const [inpPs, setInpPs] = useState('');
  const [inpQs, setInpQs] = useState('');
  const [inpIrV, setInpIrV] = useState('');
  const [inpIrA, setInpIrA] = useState('');

  // variables
  let Ir, Is, Z, θ, A, B, D, Vs, Vr, Ps, Pr, δ, Qs, Qr;

  const load = parseFloat(inpLoad) * x10_6; // multiplico x10^6 para pasarlo a MV
  const Fp = parseFloat(inpFP);

  Ir = calcIr({load, Fp, Vr, Is, inpIrV, inpIrA}); // complejo

  Z =  getComplexCart({real: inpZR, img: inpZI}) // complejo

  θ = Z ? radToAng(Z.arg()) : '';

  A = calcA({line, inpAA, inpAV}); // complejo

  B = calcB({line, inpBA, inpBV, Z}) // complejo

  D = calcD({line, inpDA, inpDV}) // complejo

  Vs = calclVs({A, B, Vr, Ir, inpVsA, inpVsV}) // complejo

  Ps = calcPs({inpPs})

  δ = calcDelta({Vs, Vr, inpVsA, Ps, A, B, D})

  Pr = calcPr({inpPr})

  Qs = calcQs({inpQs})

  Qr = calcQr({inpQr})

  Is = calcIs({Ir, D, B, Vr, Vs})

  Vr = calcVr({inpVrV, Ir, B, Vs, A}); // real

  return (
    <div className="App">
      <h1>Sistemas de potencia</h1>
      <div className='sub-container'>
        <section>
          <h2>Parámetros de entrada</h2>
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
          <p className='note'>Nota: El angulo debe estar vacio, si desea calcular: δ</p>

          <p>Vr</p>
          <span>Valor (KV)</span>
          <Input onChange={(e) => {setInpVrV(e.target.value)}} placeholder="100" />

          <p>Ir</p>
          <span>Valor (A)</span>
          <Input onChange={(e) => {setInpIrV(e.target.value)}} placeholder="100" />
          <span>Angulo (°)</span>
          <Input onChange={(e) => {setInpIrA(e.target.value)}} />

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

          <p>Potencia suministrada</p>
          <span>Ps (W)</span>
          <Input onChange={(e) => {setInpPs(e.target.value)}} placeholder="100" />
          <span>Qs (VAR)</span>
          <Input onChange={(e) => {setInpQs(e.target.value)}} placeholder="100" />

          <p>Potencia recibida</p>
          <span>Pr (W)</span>
          <Input onChange={(e) => {setInpPr(e.target.value)}} placeholder="100" />
          <span>Qr (VAR)</span>
          <Input onChange={(e) => {setInpQr(e.target.value)}} placeholder="100" />


          <p>Potencia de la carga</p>
          <span>Valor (MV)</span>
          <Input onChange={(e) => {setInpLoad(e.target.value)}} placeholder="100" />
          <span>FP (°)</span>
          <Input onChange={(e) => {setInpFP(e.target.value)}} value={inpFP} />
        </section>
        <section>
          <h2>Parámetros de salida</h2>
          { // && = si
            !!Z && (
              <p><strong>Z:</strong> {Z.toString()}</p>
            )
          }
          {
            !!θ && (
              <p><strong>θ:</strong> {θ.toString()}°</p>
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
              <p>
                <strong>Ir:</strong> {`${Ir.abs().toFixed(4)}`}
                <span className='angle'>{`${radToAng(Ir.arg()).toFixed(4)} °`}</span> A
              </p>
            )
          }
          {
            !!Vs && (
              <p>
                <strong>Vs:</strong> {`${Vs.abs().toFixed(4)}`}
                <span className='angle'>{`${radToAng(Vs.arg()).toFixed(4)} °`}</span> V
              </p>
            )
          }
          {
            !!Is && (
              <p>
                <strong>Is:</strong> {`${Is.abs().toFixed(4)}`}
                <span className='angle'>{`${radToAng(Is.arg()).toFixed(4)} °`}</span> A
              </p>
            )
          }
          {
            !!Ps && (
              <p><strong>Ps:</strong> {Ps.toString()} W</p>
            )
          }
          {
            !!δ && (
              <p><strong>δ:</strong> {δ.toString()}°</p>
            )
          }
          {
            !!Qs && (
              <p><strong>Qs:</strong> {Qs.toString()} VAR</p>
            )
          }
          {
            !!Pr && (
              <p><strong>Pr:</strong> {Pr.toString()} W</p>
            )
          }
          {
            !!Qr && (
              <p><strong>Qr:</strong> {Qr.toString()} VAR</p>
            )
          }
        </section>
      </div>
    </div>
  );
}

export default App;
