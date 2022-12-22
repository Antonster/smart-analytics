import 'antd/dist/antd.min.css';
import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
import '../node_modules/@syncfusion/ej2-querybuilder/styles/material.css';

import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router-dom';
import { Footer, Header, ProtectedRoutes } from 'src/components';
import { Dashboard, Home, Login, NotFound } from 'src/pages';

const App = () => (
  <>
    <Helmet>
      <title>human.software</title>
    </Helmet>

    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>

    <Footer />
  </>
);

export default App;
