import { Link, useNavigate } from 'react-router-dom';
import '../css/Category.css';

const Category_map = ({ subMenu }) => {
  return (
    <>
      <div className='categoryMap'>
        {subMenu === 'DrugStore' ? (
          <>
            <Link to='/drugstore/newolive'>
              <li className='subMenuList'>올리브영</li>
            </Link>
            {/* <Link to='/drugstore/olive'>
              <li className='subMenuList'>올리브영</li>
            </Link> */}
            {/* <Link to='/sorry'>
              <li className='subMenuList'>랄라블라</li>
            </Link>
            <Link to='/sorry'>
              <li className='subMenuList'>롭스</li>
            </Link> */}
          </>
        ) : null}
        {subMenu === 'clothes' ? (
          <>
            {/* <Link to='/clothes/aland'>
              <li className='subMenuList'>에이랜드</li>
            </Link> */}
            {/* <Link to='/sorry'>
              <li className='subMenuList'>무신사</li>
            </Link> */}
            {/* <Link to='/clothes/mustit'>
              <li className='subMenuList'>머스트잇</li>
            </Link> */}
          </>
        ) : null}

        {subMenu === 'Food' ? (
          <>
            <Link to='/food/rangkingdak'>
              <li className='subMenuList'>랭킹닭컴</li>
            </Link>
            {/* <Link to='/sorry'>
              <li className='subMenuList'>편의점</li>
            </Link>
            <Link to='/sorry'>
              <li className='subMenuList'>VIPS</li>
            </Link> */}
          </>
        ) : null}

        {subMenu === 'Store' ? (
          <>
            <Link to='/store/starfield'>
              <li className='subMenuList'>스타필드</li>
            </Link>
            {/* <Link to='/sorry'>
              <li className='subMenuList'>SSG</li>
            </Link>
            <Link to='/sorry'>
              <li className='subMenuList'>현대백화점</li>
            </Link> */}
          </>
        ) : null}
      </div>
    </>
  );
};
export default Category_map;
