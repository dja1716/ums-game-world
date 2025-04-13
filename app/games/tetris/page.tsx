'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

interface Tetromino {
  shape: number[][];
  color: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BASE_BLOCK_SIZE = 30;

const TETROMINOS: Record<string, Tetromino> = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f0a000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  }
};

export default function TetrisGame() {
  const [blockSize, setBlockSize] = useState(BASE_BLOCK_SIZE);
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 화면 크기에 따라 블록 크기 조정
  useEffect(() => {
    const adjustBlockSize = () => {
      const isMobile = window.innerWidth < 768;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      if (isMobile) {
        // 모바일에서는 화면 너비의 90%를 사용하고, 높이도 고려
        const maxWidthSize = (screenWidth * 0.9) / BOARD_WIDTH;
        const maxHeightSize = (screenHeight * 0.6) / BOARD_HEIGHT;
        setBlockSize(Math.floor(Math.min(maxWidthSize, maxHeightSize, BASE_BLOCK_SIZE)));
      } else {
        setBlockSize(BASE_BLOCK_SIZE);
      }
    };

    adjustBlockSize();
    window.addEventListener('resize', adjustBlockSize);
    return () => window.removeEventListener('resize', adjustBlockSize);
  }, []);

  // 보드 초기화
  const initBoard = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_WIDTH).fill(0)
    );
    setBoard(newBoard);
  };

  // 새로운 테트로미노 생성
  const createNewPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const piece: Piece = {
      shape: TETROMINOS[randomPiece].shape,
      color: TETROMINOS[randomPiece].color,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
    setCurrentPiece(piece);
  }, []);

  // 충돌 검사
  const checkCollision = (piece: Piece, board: number[][], moveX = 0, moveY = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + moveX;
          const newY = piece.y + y + moveY;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 조각 이동
  const movePiece = useCallback((moveX: number) => {
    if (!currentPiece || gameOver) return;
    if (!checkCollision(currentPiece, board, moveX, 0)) {
      setCurrentPiece({
        ...currentPiece,
        x: currentPiece.x + moveX
      });
    }
  }, [currentPiece, board, gameOver]);

  // 조각 회전
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return;
    const rotated = currentPiece.shape[0].map((_: number, index: number) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    const newPiece = {
      ...currentPiece,
      shape: rotated
    };
    if (!checkCollision(newPiece, board, 0, 0)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, board, gameOver]);

  // 조각 드롭
  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver) return;

    if (!checkCollision(currentPiece, board, 0, 1)) {
      setCurrentPiece({
        ...currentPiece,
        y: currentPiece.y + 1
      });
    } else {
      // 보드에 현재 조각 고정
      const newBoard = [...board];
      currentPiece.shape.forEach((row: number[], y: number) => {
        row.forEach((value: number, x: number) => {
          if (value) {
            const boardY = currentPiece.y + y;
            if (boardY < 0) {
              setGameOver(true);
              return;
            }
            newBoard[boardY][currentPiece.x + x] = 1;
          }
        });
      });

      // 완성된 줄 제거
      let linesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell === 1)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }

      // 점수 업데이트
      if (linesCleared > 0) {
        setScore(prev => prev + linesCleared * 100);
      }

      setBoard(newBoard);
      createNewPiece();
    }
  }, [board, currentPiece, gameOver, createNewPiece]);

  // 모바일 컨트롤러 핸들러
  const handleTouchControl = useCallback((action: 'left' | 'right' | 'rotate' | 'down') => {
    switch (action) {
      case 'left':
        movePiece(-1);
        break;
      case 'right':
        movePiece(1);
        break;
      case 'rotate':
        rotatePiece();
        break;
      case 'down':
        dropPiece();
        break;
    }
  }, [movePiece, rotatePiece, dropPiece]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case 'ArrowDown':
          dropPiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [movePiece, rotatePiece, dropPiece]);

  // 게임 루프
  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(() => {
        dropPiece();
      }, 1000);

      return () => {
        clearInterval(gameLoop);
      };
    }
  }, [gameOver, dropPiece]);

  // 게임 시작
  useEffect(() => {
    initBoard();
    createNewPiece();
  }, []);

  // 게임 재시작
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    initBoard();
    createNewPiece();
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="p-4 pb-[250px] md:pb-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-4 text-white text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">테트리스</h1>
            <p className="text-lg md:text-xl">점수: {score}</p>
          </div>
          
          <div className="relative bg-gray-800 p-2 md:p-4 rounded-lg mx-auto" style={{ maxWidth: 'fit-content' }}>
            {gameOver ? (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-[60]">
                <p className="text-white text-xl md:text-2xl mb-4">게임 오버!</p>
                <button
                  onClick={restartGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  다시 시작
                </button>
              </div>
            ) : null}
            
            <div
              style={{
                width: blockSize * BOARD_WIDTH,
                height: blockSize * BOARD_HEIGHT,
              }}
              className="grid grid-cols-10 gap-[1px] bg-gray-700"
            >
              {board.map((row, y) =>
                row.map((cell, x) => {
                  let isActive = false;
                  let activeColor = '';

                  if (currentPiece) {
                    currentPiece.shape.forEach((row: number[], pieceY: number) => {
                      row.forEach((value: number, pieceX: number) => {
                        if (
                          value &&
                          pieceY + currentPiece.y === y &&
                          pieceX + currentPiece.x === x
                        ) {
                          isActive = true;
                          activeColor = currentPiece.color;
                        }
                      });
                    });
                  }

                  return (
                    <div
                      key={`${y}-${x}`}
                      style={{
                        width: blockSize,
                        height: blockSize,
                        backgroundColor: isActive ? activeColor : cell ? '#ffffff' : '#1f2937',
                      }}
                      className="border border-gray-600"
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* PC 조작 방법 */}
        <div className="mt-4 text-white text-center hidden md:block">
          <p className="mb-2">조작 방법:</p>
          <p>← → : 이동</p>
          <p>↑ : 회전</p>
          <p>↓ : 빠른 하강</p>
        </div>
      </div>

      {/* 모바일 컨트롤러 */}
      <div className="fixed bottom-0 left-0 right-0 w-full md:hidden" style={{ position: 'fixed', bottom: 0 }}>
        <div className="bg-gray-900/95 border-t border-gray-800">
          <div className="max-w-md mx-auto p-4 pb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 flex justify-center mb-4">
                <button
                  onClick={() => handleTouchControl('rotate')}
                  className="bg-gray-800 w-20 h-20 rounded-2xl text-white active:bg-gray-700 transition flex items-center justify-center shadow-lg"
                  aria-label="회전"
                >
                  <div>위</div>
                  <ArrowUpIcon className="w-14 h-14 text-white" />

                </button>
              </div>
              <button
                onClick={() => handleTouchControl('left')}
                className="bg-gray-800 w-20 h-20 rounded-2xl text-white active:bg-gray-700 transition flex items-center justify-center shadow-lg"
                aria-label="왼쪽"
              >
                <ArrowLeftIcon className="w-10 h-10 text-white" />
              </button>
              <button
                onClick={() => handleTouchControl('down')}
                className="bg-gray-800 w-20 h-20 rounded-2xl text-white active:bg-gray-700 transition flex items-center justify-center shadow-lg"
                aria-label="아래"
              >
                <ArrowDownIcon className="w-10 h-10 text-white" />
              </button>
              <button
                onClick={() => handleTouchControl('right')}
                className="bg-gray-800 w-20 h-20 rounded-2xl text-white active:bg-gray-700 transition flex items-center justify-center shadow-lg"
                aria-label="오른쪽"
              >
                <ArrowRightIcon className="w-10 h-10 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 