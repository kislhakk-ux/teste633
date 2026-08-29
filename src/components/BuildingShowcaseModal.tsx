import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';
import { HD_BUILDING_SPRITES } from '../constants/buildingSprites';
import { getCutoutSprite } from '../utils/spriteCutout';

interface StructureModel {
  id: string;
  name: string;
  category: string;
  image: string;
  anglesSummary: string[];
  features: string[];
  description: string;
}

const STRUCTURE_MODELS: StructureModel[] = [
  {
    id: 'farmhouse',
    name: 'Casa da Fazenda (Farmhouse)',
    category: 'Residencial',
    image: HD_BUILDING_SPRITES.farmhouse,
    anglesSummary: [
      'Telhado Gambrel vermelho com mansarda chanfrada no sótão',
      'Varanda térrea frontal com deck de madeira e colunas brancas',
      'Chaminé de alvenaria com saída para fumaça volumétrica',
      'Janelas com floreiras e portas em perspectiva isométrica',
    ],
    features: [
      'Estilo arquitetônico campestre 3D estilizado',
      'Cadeira de balanço esculpida no alpendre',
      'Base de alvenaria em pedras arredondadas',
    ],
    description:
      'Centro administrativo e visual da sua propriedade rural, com varanda acolhedora e telhado de ripas vermelhas.',
  },
  {
    id: 'barn',
    name: 'Celeiro Vermelho (Barn)',
    category: 'Armazenamento',
    image: HD_BUILDING_SPRITES.barn,
    anglesSummary: [
      'Telhado metálico de 4 facetas com cume prateado',
      'Portas corrediças duplas com travamento em "X" branco',
      'Sótão superior com feno dourado e polia de guindaste',
      'Torre de ventilação com cata-vento de galo dourado',
    ],
    features: [
      'Volume cilíndrico e facetado em perspectiva de 30 graus',
      'Capacidade expansível para produtos processados e materiais',
      'Textura de tábuas de madeira avermelhada com reflexos quentes',
    ],
    description:
      'O coração do armazenamento da fazenda, projetado com a estética clássica dos celeiros americanos pré-renderizados.',
  },
  {
    id: 'silo',
    name: 'Silo de Grãos 3D (Silo)',
    category: 'Armazenamento',
    image: HD_BUILDING_SPRITES.silo,
    anglesSummary: [
      'Corpo cilíndrico com faixas de reforço metálicas',
      'Faixa vertical com visor de vidro revelando o nível de grãos',
      'Cúpula metálica escura com tampa de inspeção basculante e alça',
      'Bica de descarga tubular cromada com caçamba de coleta',
    ],
    features: [
      'Cilindro com sombreamento esférico e iluminação solar suave',
      'Visor transparente dinâmico com grãos dourados',
      'Estrutura compacta e imponente no horizonte',
    ],
    description:
      'Torre de grãos com visor graduado para acompanhar o estoque de trigo, milho, cana e cenouras colhidas.',
  },
  {
    id: 'bakery',
    name: 'Padaria Artesanal (Bakery)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.bakery,
    anglesSummary: [
      'Forno abobadado em pedras e argila rústica',
      'Bancada de madeira com toldo listrado vermelho e branco',
      'Boca do forno com arco de tijolos e brasas incandescentes',
      'Pá de forno com pão artesanal e sacas de farinha fofas',
    ],
    features: [
      'Chaminé traseira soltando fumaça branca constante',
      'Pães, baguetes e tortas expostos na bancada de preparo',
      'Iluminação quente de fogo e sol do amanhecer',
    ],
    description:
      'Forno à lenha tradicional que assa pães crocantes, biscoitos e tortas com aroma irresistível.',
  },
  {
    id: 'feed_mill',
    name: 'Moedor de Ração (Feed Mill)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.feed_mill,
    anglesSummary: [
      'Tambor cilíndrico vermelho horizontal com estrela dourada',
      'Chaminé curva cromada soltando fumaça cinza-clara',
      'Cavalete de suporte tubular em amarelo industrial',
      'Tremonha superior de grãos e sacas de estopa de ração prontas',
    ],
    features: [
      'Mecanismo de moagem compacto e dinâmico',
      'Sacas de juta com sementes e grãos ao lado da base',
      'Renderização volumétrica com brilho metálico',
    ],
    description:
      'Moinho mecânico que processa grãos em ração balanceada para vacas, galinhas, porcos e ovelhas.',
  },
  {
    id: 'dairy',
    name: 'Laticínio (Dairy)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.dairy,
    anglesSummary: [
      'Telhado vermelho brilhante com 3 ventiladores de sino dourados',
      'Paredes brancas de estuque com tijolos de argila aparentes na base',
      'Estrela amarela decorativa em relevo na fachada',
      'Calha/esteira transportadora lateral e latões de leite prateados',
    ],
    features: [
      'Deck de madeira para carregamento de queijos e manteiga',
      'Janelas redondas tipo olho-de-boi com aro de latão',
      'Múltiplos planos angulares com sombras suaves de oclusão',
    ],
    description:
      'Fábrica de laticínios artesanais onde o leite fresco das vacas é transformado em queijos e cremes.',
  },
  {
    id: 'sugar_mill',
    name: 'Engenho de Açúcar (Sugar Mill)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.sugar_mill,
    anglesSummary: [
      'Galpão de madeira rústica com cobertura de palha verde',
      'Rolos compressores de ferro fundido para moagem de cana',
      'Caldeirão de cobre fervente com xarope e vapor adocicado',
      'Barris de madeira cheios de açúcar mascavo e refinado',
    ],
    features: [
      'Moinho de cana tradicional pré-renderizado',
      'Detalhes tridimensionais de caules e tachos',
      'Iluminação quente de processo artesanal',
    ],
    description:
      'Engenho açucareiro onde a cana-de-açúcar é prensada e refinada em açúcar mascavo, açúcar branco e xaropes.',
  },
  {
    id: 'bbq_grill',
    name: 'Churrasqueira & Grelha (BBQ Grill)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.bbq_grill,
    anglesSummary: [
      'Pit de alvenaria em tijolos vermelhos com grelha de ferro',
      'Brasas incandescentes e carnes apetitosas grelhando',
      'Capô exaustor preto com chaminé alta soltando fumaça',
      'Prateleira lateral de molhos barbecue e nicho de lenha',
    ],
    features: [
      'Grelha com efeito de calor e defumação',
      'Pancakes, bacon com ovos e hambúrgueres artesanais',
      'Textura rústica e iluminação realista',
    ],
    description:
      'Grelha e defumador a carvão para preparar pratos suculentos e refeições completas para os pedidos.',
  },
  {
    id: 'popcorn_pot',
    name: 'Pipoqueira Retrô (Popcorn Pot)',
    category: 'Produção',
    image: HD_BUILDING_SPRITES.popcorn_pot,
    anglesSummary: [
      'Carrinho vintage vermelho e dourado com rodas de raios',
      'Vitríne de vidro transparente cheia de pipoca crocante',
      'Panela caldeirão de cobre estourando milho no topo',
      'Toldo listrado vermelho e branco de circo/parque',
    ],
    features: [
      'Design nostálgico e lúdico estilo parque de diversões',
      'Milho na manteiga e pipoca doce caramelizada',
      'Vidro com reflexos e grãos dourados explodindo',
    ],
    description:
      'Pipoqueira retrô que transforma milho e manteiga em pipocas crocantes e deliciosas.',
  },
  {
    id: 'roadside_shop',
    name: 'Banca de Vendas (Roadside Stand)',
    category: 'Comércio',
    image: HD_BUILDING_SPRITES.roadside_shop,
    anglesSummary: [
      'Balcão de madeira rústica com caixotes de exposição',
      'Toldo listrado com placa indicativa de madeira entalhada',
      'Caixa registradora vintage de metal com gaveta de moedas',
      'Exibição de ovos, leite, pães e legumes frescos',
    ],
    features: [
      'Ponto comercial da fazenda para vendas diretas',
      'Caixotes de feira com frutas e produtos artesanais',
      'Ângulo isométrico detalhado para comércio à beira da estrada',
    ],
    description:
      'Sua banca na beira da estrada para anunciar e vender excedentes da fazenda a preços personalizados.',
  },
  {
    id: 'order_board',
    name: 'Quadro de Pedidos (Order Board)',
    category: 'Comércio',
    image: HD_BUILDING_SPRITES.order_board,
    anglesSummary: [
      'Moldura de madeira maciça com cobertura de telhas rústicas',
      'Quadro de cortiça com pedidos em papel, selos e retratos',
      'Postes fincados na grama com flores silvestres ao redor',
      'Iluminação natural e detalhes de pregos e carimbos coloridos',
    ],
    features: [
      'Mural clássico de missões e entregas de caminhão',
      'Avisos dos moradores da cidade com recompensas',
      'Integração visual com a entrada da fazenda',
    ],
    description:
      'O mural onde os cidadãos da vila deixam pedidos urgentes para serem atendidos pelo seu caminhão de entregas.',
  },
  {
    id: 'lucky_wheel',
    name: 'Caminhão da Roleta (Lucky Wheel Truck)',
    category: 'Eventos',
    image: HD_BUILDING_SPRITES.lucky_wheel,
    anglesSummary: [
      'Caminhonete vintage vermelha de entrega campestre',
      'Roleta colorida de prêmios estilo parque de diversões',
      'Lâmpadas cintilantes e ponteiro dourado de premiação',
      'Detalhes cromados e faixas decorativas festivas',
    ],
    features: [
      'Veículo de evento diário com prêmios gratuitos',
      'Giro da sorte com diamantes, moedas e materiais raros',
      'Estética festiva que contrasta com a calma da fazenda',
    ],
    description:
      'O caminhão itinerante da sorte que visita sua fazenda todos os dias com prêmios e materiais de expansão!',
  },
  {
    id: 'ground_tile',
    name: 'Chão de Grama Isométrica (Lawn Grass)',
    category: 'Terreno',
    image: HD_BUILDING_SPRITES.ground_tile,
    anglesSummary: [
      'Piso de grama verde-limão vibrante com textura 3D',
      'Gradeamento sutil em losango isométrico a 30 graus',
      'Margaridas brancas, trevos e tufos de relva espalhados',
      'Iluminação solar quente com oclusão ambiente nas bordas',
    ],
    features: [
      'Textura orgânica de relevo campestre estilo Hay Day',
      'Integração contínua com a terra e caminhos da fazenda',
      'Elimina qualquer sensação de elementos soltos no ar',
    ],
    description:
      'Piso e relevo do cenário da fazenda com grama aparada e pequenos trevos, servindo de tapete natural para todas as construções.',
  },
  {
    id: 'dirt_base',
    name: 'Placa de Terra & Cascalho (Dirt Base)',
    category: 'Fundação',
    image: HD_BUILDING_SPRITES.dirt_base,
    anglesSummary: [
      'Lote isométrico de terra fértil batida e pedriscos miúdos',
      'Guia de meio-fio com pedras arredondadas e estacas de madeira',
      'Tufos de relva natural brotando ao longo do perímetro',
      'Sombra oclusiva de contato que ancora o edifício na terra',
    ],
    features: [
      'Fundação realista usada sob o Celeiro, Silo e Moedor',
      'Conexão visual perfeita entre a grama e as máquinas',
      'Textura tátil de terra de cultivo',
    ],
    description:
      'Fundação de solo batido e cascalho que ancora celeiros, silos e moinhos firmemente ao chão da fazenda.',
  },
  {
    id: 'cobblestone_base',
    name: 'Pátio de Paralelepípedos (Cobblestone Base)',
    category: 'Fundação',
    image: HD_BUILDING_SPRITES.cobblestone_base,
    anglesSummary: [
      'Piso rústico de lajotas de pedra e pedras mouriscas',
      'Bordas com vigas de madeira tratada e musgo nas frestas',
      'Perspectiva em losango isométrico perfeita',
      'Superfície firme para fornos, lareiras e churrasqueiras',
    ],
    features: [
      'Usado na Padaria, Churrasqueira e Casa Principal',
      'Resistência estética ao fogo e brasas',
      'Acabamento artesanal de vila rural',
    ],
    description:
      'Pátio de pedras e lajotas rústicas que dá suporte e firmeza à Padaria, Churrasqueira e Casa da Fazenda.',
  },
  {
    id: 'wood_base',
    name: 'Deck de Madeira Rústica (Wood Base)',
    category: 'Fundação',
    image: HD_BUILDING_SPRITES.wood_base,
    anglesSummary: [
      'Pranchas de tábuas de pinho e carvalho aparelhadas',
      'Cantoneiras metálicas e pregos rústicos visíveis',
      'Tufos de grama verde ao redor das extremidades',
      'Sombra quente e aconchegante sobre a relva',
    ],
    features: [
      'Plataforma de apoio para a Pipoqueira, Laticínio e Banca',
      'Estilo de cais e feira campestre',
      'Fixação total do maquinário ao solo',
    ],
    description:
      'Plataforma de pranchas de madeira que serve de base para o Laticínio, Pipoqueira Retrô e Banca de Vendas.',
  },
];

interface BuildingShowcaseModalProps {
  onClose: () => void;
}

export const BuildingShowcaseModal: React.FC<BuildingShowcaseModalProps> = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState<string>(STRUCTURE_MODELS[0].id);
  const [cutoutMap, setCutoutMap] = useState<Record<string, string>>({});

  const currentModel =
    STRUCTURE_MODELS.find((m) => m.id === selectedId) || STRUCTURE_MODELS[0];

  useEffect(() => {
    let isMounted = true;
    getCutoutSprite(currentModel.image).then((res) => {
      if (isMounted) {
        setCutoutMap((prev) => ({ ...prev, [currentModel.id]: res }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentModel.id, currentModel.image]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff8e1] via-[#ffecb3] to-[#ffe082] border-4 border-[#ff8f00] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-4xl w-full relative flex flex-col gap-4 max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🏛️</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
                Modelos 3D das Estruturas
              </h2>
              <p className="text-xs text-amber-800 font-semibold">
                Estruturas estilizadas em 3D pré-renderizado integradas diretamente no jogo
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xl border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Category / Structure Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500">
          {STRUCTURE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                sound.playClick();
                setSelectedId(model.id);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-1.5 ${
                selectedId === model.id
                  ? 'bg-amber-800 text-yellow-200 border-yellow-400 shadow-md scale-105'
                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              }`}
            >
              <img
                src={model.image}
                alt={model.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 object-contain rounded-md"
              />
              <span>{model.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Model Showcase Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1">
          {/* Visual Showcase Panel */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-200/70 border-3 border-amber-400/80 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-inner min-h-[260px]">
            <div className="absolute top-3 left-3 bg-amber-900 text-amber-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-300 shadow">
              {currentModel.category}
            </div>
            <div className="absolute top-3 right-3 bg-green-700 text-green-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-green-300 shadow flex items-center gap-1">
              <span>✓</span> Em Uso no Jogo
            </div>

            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center my-2 group">
              {/* Ground Shadow */}
              <div className="absolute bottom-2 w-48 h-8 bg-black/25 rounded-full blur-md" />
              <img
                src={cutoutMap[currentModel.id] || currentModel.image}
                alt={currentModel.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain filter drop-shadow-xl transition-transform duration-300 group-hover:scale-105 ${
                  !cutoutMap[currentModel.id] ? 'mix-blend-multiply' : ''
                }`}
              />
            </div>

            <div className="text-center mt-1">
              <span className="text-xs font-black text-amber-900 bg-amber-300/80 px-3 py-1 rounded-full border border-amber-400">
                Ângulo Isométrico Pré-Renderizado (30°)
              </span>
            </div>
          </div>

          {/* Details & Architecture Specs */}
          <div className="flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2.5">
              <div>
                <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
                  <span>{currentModel.name}</span>
                </h3>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  {currentModel.description}
                </p>
              </div>

              {/* Angles Breakdown */}
              <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-3 shadow-xs">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <span>📐</span> Detalhes & Facetas Angulares
                </h4>
                <ul className="space-y-1">
                  {currentModel.anglesSummary.map((angle, idx) => (
                    <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold text-xs mt-0.5">•</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights */}
              <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-3 shadow-xs">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <span>🎨</span> Características de Textura & Volume
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentModel.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-200/90 text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-amber-300"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-green-100/90 border border-green-300 rounded-xl text-[11px] text-green-900 font-medium flex items-center gap-2">
              <span className="text-base">🚀</span>
              <span>
                Esses modelos já estão ativos no cenário da sua fazenda. Você pode alternar entre 3D e 2D no botão superior <strong>✨ 3D</strong> a qualquer momento.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
