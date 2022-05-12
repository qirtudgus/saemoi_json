import sae from '../img/sae.svg';
import '../css/about.css';
import Footer from './footer';

const About = () => {
  // const [apiData, setApiData] = useState([]);
  //     useEffect(()=>{
  //     axios.get("https://sungtt.com/api")
  //     .then(res => {
  //        console.log(res.data);
  //        setApiData([...res.data]);
  //     })
  // },[])

  return (
    <>
      <div className='aboutBox'>
        <img src={sae} alt='saemoi character'></img>
        <h1>
          귀하신 분이 <br />
          누추한 곳에 무슨일로..?
        </h1>
        {/* {apiData.map(i => (
              <>
              <p>{i.title}</p>
              <p>{i.content}</p>
              </>
          ))} */}
      </div>
      <Footer />
    </>
  );
};

export default About;
