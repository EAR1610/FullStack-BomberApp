import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/MiniLogo.png';
import { SidebarProps } from '../../helpers/Interfaces';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';

import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const reportItems: MenuItem[] = [
    {
      label: 'Reportes',
      icon: 'pi pi-file-excel',
      items: [
        {
          label: 'Emergencias',
          icon: 'pi pi-exclamation-triangle',
          command: () => navigate('./report-emergency')
        },
        {
          label: 'Asignación de turnos',
          icon: 'pi pi-calendar',
          command: () => navigate('./report-firefighter-shift')
        },
        {
          label: 'Bitácora',
          icon: 'pi pi-file-check',
          command: () => navigate('./report-log')
        }
      ]
    }
  ];

  const userItems: MenuItem[] = [
    {
      label: 'Usuario',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-user',
          command: () => navigate('./users')
        },
        {
          label: 'Usuarios Penalizados',
          icon: 'pi pi-user',
          command: () => navigate('./penalized-users')
        }
      ]
    }
  ]

  const emergencyItems: MenuItem[] = [
    {
      label: 'Emergencia',
      icon: 'pi pi-heart-fill',
      items: [
        {
          label: 'Emergencias',
          icon: 'pi pi-heart-fill',
          command: () => navigate('./emergencies')
        },
        {
          label: 'Emergencias por llamada',
          icon: 'pi pi-mobile',
          command: () => navigate('./emergency-request-by-admin')
        },
        {
          label: 'Tipo de Emergencias',
          icon: 'pi pi-wrench',
          command: () => navigate('./emergencies-type')
        }
      ]
    }
  ]

  const toolItems: MenuItem[] = [
    {
      label: 'Herramientas',
      icon: 'pi pi-wrench',
      items: [
        {
          label: 'Herramientas',
          icon: 'pi pi-wrench',
          command: () => navigate('./tools')
        },
        {
          label: 'Tipo de herramientas',
          icon: 'pi pi-hammer',
          command: () => navigate('./tool-type')
        },        
      ]
    }
  ]

  const supplyItems: MenuItem[] = [
    {
      label: 'Insumos',
      icon: 'pi pi-gift',
      items: [
        {
          label: 'Insumos',
          icon: 'pi pi-gift',
          command: () => navigate('./supply')
        },
        {
          label: 'Tipo de insumos',
          icon: 'pi pi-hammer',
          command: () => navigate('./supply-type')
        },        
      ]
    }
  ]

  const vehicleItems: MenuItem[] = [
    {
      label: 'Unidades',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Unidades',
          icon: 'pi pi-car',
          command: () => navigate('./vehicles')
        },
        {
          label: 'Tipo de unidades',
          icon: 'pi pi-cog',
          command: () => navigate('./vehicles-type')
        },        
      ]
    }
  ]

  const firefighterItems: MenuItem[] = [
    {
      label: 'Bomberos',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Bomberos',
          icon: 'pi pi-user',
          command: () => navigate('./firefighters')
        },
      ]
    }
  ]

  const blogItems: MenuItem[] = [
    {
      label: 'Blog',
      icon: 'pi pi-code',
      items: [
        {
          label: 'Blog',
          icon: 'pi pi-clipboard',
          command: () => navigate('./blogs')
        },
        {
          label: 'Crear una nueva categoria',
          icon: 'pi pi-file-plus',
          command: () => navigate('./create-blog-category')
        },
        {
          label: 'Crear un nuevo post',
          icon: 'pi pi-file-plus',
          command: () => navigate('./create-blog')
        } 
      ]
    }
  ]

  const originItems: MenuItem[] = [
    {
      label: 'Origen',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Origen',
          icon: 'pi pi-user',
          command: () => navigate('./origin-type')
        },
      ]
    }
  ]

  const equipmentItems: MenuItem[] = [
    {
      label: 'Equipo',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Equipo',
          icon: 'pi pi-user',
          command: () => navigate('./equipment-type')
        },
      ]
    }
  ]

  const settingsItems: MenuItem[] = [
    {
      label: 'Configuraciones',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Configuraciones',
          icon: 'pi pi-cog',
          command: () => navigate('./settings')
        },
      ]
    }
  ]

  // * close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // * close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="#">
          <img src={Logo} alt="Logo" className='rounded-lg'/>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}
      { currentToken?.user.isAdmin && (
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">              
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="./dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dashboard') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                 <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z"/>
                  </svg>


                  Dashboard
                </NavLink>
              </li>

              <PanelMenu model={userItems} className="w-full" />
              <PanelMenu model={firefighterItems} className="w-full" />
              <PanelMenu model={emergencyItems} className="w-full" />
              <PanelMenu model={toolItems} className="w-full" />
              <PanelMenu model={supplyItems} className="w-full" />
              <PanelMenu model={vehicleItems} className="w-full" />
              <PanelMenu model={originItems} className="w-full" />
              <PanelMenu model={equipmentItems} className="w-full" />
              <PanelMenu model={blogItems} className="w-full" />
              <PanelMenu model={reportItems} className="w-full" />
              <PanelMenu model={settingsItems} className="w-full" />              
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
      )}
      
      { currentToken?.firefighter && (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <ul className="mb-6 flex flex-col gap-1.5"> 
              {/* <!-- Menu Item Firefighter Shift--> */}
              <li>
                    <NavLink
                      to="./firefighter-shift"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                      </svg>

                      Horario
                    </NavLink>
              </li>
              {/* <!-- Menu Item Firefighter --> */}

              {/* <!-- Menu Item Firefighter Emergencies-> */}
              <li>
                    <NavLink
                      to="./firefighter-emergencies"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
                      </svg>

                      Mis Emergencias
                    </NavLink>
              </li>
              {/* <!-- Menu Item Firefighter Emergencies --> */}

              {/* <!-- Menu Item Blog--> */}
              <li>
                <NavLink
                  to="./blogs"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                    </svg>
                
                  Blog
                </NavLink>
              </li>
              {/* <!-- Menu Item Blog --> */}

              {/* <!-- Menu Item Create Blog--> */}
              <li>
                <NavLink
                  to="./create-blog"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
                    </svg>
                
                  Crear nuevo post
                </NavLink>
              </li>
              {/* <!-- Menu Item Create Blog --> */}            
            </ul>
          </nav>
        </div>
      )}

      { currentToken?.user.isUser && (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <ul className="mb-6 flex flex-col gap-1.5">              
              { /* <!-- Menu Item Emergency Request--> */ }
              <li>
                <NavLink
                  to="./emergency-request"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
                  </svg>
                
                  Solicitar Emergencia
                </NavLink>
              </li>
              {/* <!-- Menu Item Emergency --> */}

              {/* <!-- Menu Item My Emergencies--> */}
              <li>
                <NavLink
                  to="./my-emergencies"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
                    </svg>
                
                  Mis Emergencias
                </NavLink>
              </li>

              {/* <!-- Menu Item Blog--> */}
              <li>
                <NavLink
                  to="./blogs"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                    </svg>
                
                  Blog
                </NavLink>
              </li>
              {/* <!-- Menu Item Blog --> */}
            </ul>
          </nav>
        </div>
        )
      } 
    </aside>
  );
};

export default Sidebar;
