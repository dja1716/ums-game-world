'use client';

import { useEffect, useState, useCallback } from 'react';

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
const BLOCK_SIZE = 30;

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
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 보드 초기화
  const initBoard = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_WIDTH).fill(0)
    );
    setBoard(newBoard);
  };

  // 새로운 테트로미노 생성
  const createNewPiece = () => {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const piece: Piece = {
      shape: TETROMINOS[randomPiece].shape,
      color: TETROMINOS[randomPiece].color,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
    setCurrentPiece(piece);
  };

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
  }, [movePiece, rotatePiece]);

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
  }, [currentPiece, gameOver, dropPiece]);

  // 조각 드롭
  const dropPiece = () => {
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
  };

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-white">
        <h1 className="text-3xl font-bold mb-2">테트리스</h1>
        <p className="text-xl">점수: {score}</p>
      </div>
      
      <div className="relative bg-gray-800 p-4 rounded-lg">
        {gameOver ? (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col">
            <p className="text-white text-2xl mb-4">게임 오버!</p>
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
            width: BLOCK_SIZE * BOARD_WIDTH,
            height: BLOCK_SIZE * BOARD_HEIGHT,
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
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    backgroundColor: isActive ? activeColor : cell ? '#ffffff' : '#1f2937',
                  }}
                  className="border border-gray-600"
                />
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 text-white text-center">
        <p className="mb-2">조작 방법:</p>
        <p>← → : 이동</p>
        <p>↑ : 회전</p>
        <p>↓ : 빠른 하강</p>
      </div>
    </div>
  );
} 