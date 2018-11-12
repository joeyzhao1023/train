/**
 * Created by joeyzhao on 2018/11/11.
 */

var test_str = '19216211';
// 1,9,216,211
// 1,92,16,211
// 1,92,162,11
// 19,2,16,211
// 19,2,162,11
// 19,21,6,211
// 19,21,62,11
// 192,1,6,211
// 192,1,62,11
// 192,16,2,11
// 192,16,21,1
// 192,162,1,1

function parse_ip(src_ip){
    var src_ip_list=[];
    if(src_ip.length<4 || src_ip.length>12){
        console.error('input error');
    }
    function cut_ip(ip, count, head_list){
        // return the list of the cut ip which count
        var i, try_ip, tmp_list=[];
    
        if(ip.length < count || ip.length > 3*count){
            return tmp_list;
        }
        if(count === 1){
            if(ip<=255){
                tmp_list.push(ip);
            }
            return tmp_list;
        }
        for(i=1; i<=3&&i<ip.length; i++){
            try_ip = ip.substring(0, i);
            if(try_ip>255){
                break;
            }
            head_list.push(try_ip);
            left_lst = cut_ip(ip.substring(i), count - 1, head_list);
            if(left_lst.length + head_list.length === 4){
                tmp_list = head_list.concat(left_lst);
                src_ip_list.push(tmp_list);
            }
            head_list.pop();
            
            console.log('ip'+ip+',count'+count+',head'+head_list.join('.') + ',left'+left_lst.join('.'));
        }
        return tmp_list;
        
    }

    cut_ip(src_ip, 4, []);
    return src_ip_list;
}

var test_out = parse_ip(test_str);
for(var i=0; i<test_out.length; i++){
    console.log(test_out[i].join('.'));
}