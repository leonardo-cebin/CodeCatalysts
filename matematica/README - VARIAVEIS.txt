Aceleração Gravitacional em São Paulo: 9,786366 m/s² -- constante --.

<h3>Mod. Bomba</h3>

Altura Manométrica*   (m, float)
Altura de Sucção*  (m, float)
Temperatura Média do Fluído   C, F ou K
Vazão desejada*   (litros/minuto)
Densidade fluído   (kg/m^3)
(formula 2) Pressão atmosférica (atm, ou mmhg, ou pascals. pascals será o default que virá selecionado)
* pode-se perguntar isso OU a altitude 
Pressão do fluído na captação / Valvula de pé  
* (atm ou pascals ou mmhg, preparar para receber os 3 tipos e fazer conversões de atm e mmhg para pascal)
* mmhg = Milimetros de Mercúrio
* Pode-se calcular isso através da da diferença de altura entre a superfície do reservatório e a válvula de pé
Pressão de Vapor fluido
* (pascals ou mmhg, preparar para receber em mmhg e fazer conversões para pascal)
Perda de carga no trajeto da sucção
Perda de carga inerente ao modelo e ao formato interno da bomba
* valor não-nulo que varia de dispositivo para dispositivo, especificado pelo fabricante e informado no manual correspondente



<h3>Mod. Calor</h3>

Temperatura de Entrada Fluido 1*     C, F ou K, float
Temperatura de Entrada Fluido 2*     C, F ou K, float
Vazão Fluído 1*     (litros/minuto) ou (kg/s)
Vazão Fluído 2*     (litros/minuto) ou (kg/s)
Area de contato (A)*: área de contato de um trocador de calor será obtida pela seguinte 
*fórmula: 2 * Raio do tubo * Pi * Comprimento * Numero de Tubos
* Unidade metros quadrados
U: característica do material com que o trocador de calor foi fabricado, varia de acordo com especificações do sistema e com o modelo do dispositivo

* no caso de um trocador de calor de tubos segue as especificações da máquina que devem constar: (essas especificações são constantes para cada aparelho portanto se o usuário utiliza apenas um aparelho estas permanecerão inalteradas essas informações devem ser salvas no banco de dados do programa)
* um. raio do tubo, isto é, metade do diâmetro 
* dois. comprimento do tubo 
* três. quantidade total de tubos



<h3>Mod. Carga</h3>
Pressão inicial, chamado de P0
Comprimento da tubulação
Velocidade                    m/s, float
Viscosidade do fluído
Densidade do fluído       (kg/m^3)
