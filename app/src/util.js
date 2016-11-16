module.exports = {
    randomColor: function() {
        // let letters = '0123456789ABCDEF'.split('');
        // let color = '#';
        // for (var i = 0; i < 6; i++) {
        //     color += letters[Math.floor(Math.random() * 16)];
        // }
        // return color;
        return randomColor({
            luminosity: 'bright'
        });
    },
    randCoord: function(maxX, maxY) {
        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        }
    },
    arrayRand: function(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
};
